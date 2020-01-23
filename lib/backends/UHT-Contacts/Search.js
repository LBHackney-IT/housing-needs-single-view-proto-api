const path = require('path');
const {
  formatAddress,
  checkString,
  nameCase,
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
    whereClause.push(
      'forename collate SQL_Latin1_General_CP1_CI_AS LIKE @forename'
    );
  }

  if (queryParams.lastName && queryParams.lastName !== '') {
    params.push({
      id: 'surname',
      type: 'NVarChar',
      value: `%${queryParams.lastName.toUpperCase()}%`
    });
    whereClause.push(
      'surname collate SQL_Latin1_General_CP1_CI_AS LIKE @surname'
    );
  }
  whereClause = whereClause.map(clause => `(${clause})`);

  let query = `${searchCustomersBaseSQL} WHERE (${whereClause.join(' AND ')})`;

  return await db.request(query, params);
}

let processSearchResults = function(results) {
  return results.map(record => {
    return {
      id: `${record.house_ref.trim()}/${record.person_no}`,
      firstName: nameCase(record.forename),
      lastName: nameCase(record.surname),
      dob: record.dob ? formatDisplayDate(record.dob) : null,
      nino: upperCase(record.ni_no),
      address: formatAddress(record.address).join(', '),
      postcode: checkString(record.postcode),
      source: Systems.UHT_CONTACTS,
      links: {
        uhContact: record.con_key
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
      console.log(`Error searching customers in UHT-Contacts: ${err}`);
      return [];
    }
  };
};
