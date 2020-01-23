const path = require('path');
const {
  checkString,
  nameCase,
  formatAddress,
  formatDisplayDate,
  upperCase,
  loadSQL
} = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersBaseSQL } = loadSQL(path.join(__dirname, 'sql'));

async function runSearchQuery(queryParams, db) {
  let whereClause = [];
  let params = [];

  if (queryParams.firstName && queryParams.firstName !== '') {
    params.push({
      id: 'forename',
      type: 'NVarChar',
      value: `%${queryParams.firstName.toUpperCase()}%`
    });
    whereClause.push('forename LIKE @forename');
  }

  if (queryParams.lastName && queryParams.lastName !== '') {
    params.push({
      id: 'surname',
      type: 'NVarChar',
      value: `%${queryParams.lastName.toUpperCase()}%`
    });
    whereClause.push('surname LIKE @surname');
  }
  whereClause = whereClause.map(clause => `(${clause})`);

  let query = `${searchCustomersBaseSQL} AND(${whereClause.join(' AND ')})`;

  return await db.request(query, params);
}

let processSearchResults = function(results) {
  return results.map(record => {
    return {
      id: `${record.claim_id}${record.check_digit}/${record.person_ref}`,
      firstName: nameCase(record.forename),
      lastName: nameCase(record.surname),
      dob: record.birth_date ? formatDisplayDate(record.birth_date) : null,
      nino: upperCase(record.nino),
      address: formatAddress([
        record.addr1,
        record.addr2,
        record.addr3,
        record.addr4,
        record.post_code
      ]).join(', '),
      postcode: checkString(record.post_code),
      source: Systems.ACADEMY_BENEFITS,
      links: {
        hbClaimId: record.claim_id
      }
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async query => {
    try {
      const results = await runSearchQuery(query, db);
      return processSearchResults(results);
    } catch (err) {
      console.log(`Error searching customers in Academy-Benefits: ${err}`);
      return [];
    }
  };
};
