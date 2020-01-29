const path = require('path');
const {
  checkString,
  nameCase,
  formatDisplayDate,
  loadSQL
} = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersBaseSQL } = loadSQL(path.join(__dirname, 'sql'));

const runSearchQuery = async (queryParams, db) => {
  let whereClause = [];
  let params = [];

  if (queryParams.firstName && queryParams.firstName !== '') {
    params.push({
      id: 'forename',
      type: 'NVarChar',
      value: `%${queryParams.firstName.toLowerCase()}%`
    });
    whereClause.push(
      'Forenames collate SQL_Latin1_General_CP1_CI_AS LIKE @forename'
    );
  }

  if (queryParams.lastName && queryParams.lastName !== '') {
    params.push({
      id: 'surname',
      type: 'NVarChar',
      value: `%${queryParams.lastName.toLowerCase()}%`
    });
    whereClause.push(
      'Surname collate SQL_Latin1_General_CP1_CI_AS LIKE @surname'
    );
  }
  whereClause = whereClause.map(clause => `(${clause})`);

  let query = `${searchCustomersBaseSQL} WHERE (${whereClause.join(' AND ')})`;

  return await db.request(query, params);
};

const processSearchResults = results => {
  return results.map(record => {
    return {
      id: record.ContactNo.toString(),
      firstName: record.Forenames ? nameCase(record.Forenames) : null,
      lastName: record.Surname ? nameCase(record.Surname) : null,
      dob: record.DOB ? formatDisplayDate(record.DOB) : null,
      nino: record.Nino,
      address: null,
      postcode: checkString(record.PostCode),
      source: Systems.UHW,
      links: {
        uhContact: record.UHContact
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
      console.log(`Error searching customers in UHW: ${err}`);
      return [];
    }
  };
};
