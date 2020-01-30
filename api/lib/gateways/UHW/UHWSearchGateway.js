const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersBaseSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildSearchRecord = options.buildSearchRecord;

  const search = async queryParams => {
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

    const query = `${searchCustomersBaseSQL} WHERE (${whereClause.join(
      ' AND '
    )})`;

    return await db.request(query, params);
  };

  const processRecords = records => {
    return records.map(record => {
      return buildSearchRecord({
        id: record.ContactNo.toString(),
        firstName: record.Forenames,
        lastName: record.Surname,
        dob: record.DOB,
        nino: record.Nino,
        address: null,
        postcode: record.PostCode,
        source: Systems.UHW,
        links: {
          uhContact: record.UHContact
        }
      });
    });
  };

  return {
    execute: async queryParams => {
      try {
        const records = await search(queryParams);
        return processRecords(records);
      } catch (err) {
        console.log(`Error searching customers in UHW: ${err}`);
        return [];
      }
    }
  };
};
