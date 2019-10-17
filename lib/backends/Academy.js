const sql = require("mssql");
const strftime = require('strftime');
const {addOptionProp, formatPhone, formatAddress, checkString} = require('../Utils');

let config = {
    user: process.env.Academy_user,
    password: process.env.Academy_password,
    server: process.env.Academy_server,
    database: process.env.Academy_database
};

const pool = new sql.ConnectionPool(config)

pool.on('error', err => {
  console.log(err);
})

pool.connect();

async function runSearchQuery(queryParams){
  let whereClause = []
  await pool;

  let request = pool.request();

  if(queryParams.firstName && queryParams.firstName !== ''){
    request.input('forename', sql.NVarChar, `%${queryParams.firstName.toUpperCase()}%`)
    whereClause.push('forename LIKE @forename')
  }

  if(queryParams.lastName && queryParams.lastName !== ''){
    request.input('surname', sql.NVarChar, `%${queryParams.lastName.toUpperCase()}%`)
    whereClause.push('surname LIKE @surname')
  }
  whereClause = whereClause.map(clause => `(${clause})`)
  
  let query = `SELECT
  hbmember.claim_id,
	hbmember.forename,
	hbmember.surname,
	hbmember.birth_date,
	hbmember.nino,
	hbhousehold.addr1,
	hbhousehold.addr2,
	hbhousehold.addr3,
	hbhousehold.addr4,
	hbhousehold.post_code
FROM
	hbmember
	LEFT JOIN hbhousehold ON hbmember.claim_id = hbhousehold.claim_id
		AND hbmember.house_id = hbhousehold.house_id
WHERE
	hbhousehold.to_date = '2099-12-31'
	AND(${whereClause.join(' AND ')})`;

  try{
    return request.query(query)
  }catch (err) {
    console.log(err)
  }
}

let processResults = function(results){
  return results.recordset.map(record => {
    return {
      id: record.claim_id.toString(),
      firstName: checkString(record.forename),
      lastName: checkString(record.surname),
      dob: record.birth_date ? strftime('%d/%m/%Y', record.birth_date) : null,
      nino: checkString(record.nino),
      address: checkString([record.addr1.trim(),record.addr2.trim(),record.addr3.trim(),record.addr4.trim(),record.post_code.trim()].filter(x => x!== '').join("\n")) ,
      postcode: checkString(record.post_code),
      source: "ACADEMY"
    }
  })
}

let Backend = {
  customerSearch: function(query, cb){
    if(query.firstName && query.firstName !== '' && query.lastName && query.lastName !== ''){
      runSearchQuery(query)
        .then(results => {
          cb(processResults(results));
        })
    }else{
      cb([]);
    }
  },

  fetchCustomer: function(id, customer, cb){
    customer.benefitClaimId = id;
    cb()
    /*
    runFetchQuery(id)
      .then(res => {
        processCustomer(res.recordset[0], customer);
        cb()
      });
    */
  },

  fetchCustomerNotes: function(id, cb){
    cb([]);
  }
}

module.exports = Backend;