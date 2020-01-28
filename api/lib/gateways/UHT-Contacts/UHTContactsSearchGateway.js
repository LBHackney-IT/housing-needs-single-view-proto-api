const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersBaseSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildSearchRecord = options.buildSearchRecord;

  let whereClause = [];
  let params = [];

  const search = async queryParams => {
    if (queryParams.firstName && queryParams.firstName !== '') {
      params.push({
        id: 'forename',
        type: 'NVarChar',
        value: `%${queryParams.firstName.toUpperCase()}%`
      });
      whereClause.push(
        'forename collate SQL_Latin1_General_CP1_CI_AS LIKE @forename'
      )
    }

    if (queryParams.lastName && queryParams.lastName !== '') {
      params.push({
        id: 'surname',
        type: 'NVarChar',
        value: `%${queryParams.lastName.toUpperCase()}%`
      });
      whereClause.push(
        'surname collate SQL_Latin1_General_CP1_CI_AS LIKE @surname'
      )
    };

    whereClause = whereClause.map(clause => `(${clause})`);
    const query = `${searchCustomersBaseSQL} WHERE (${whereClause.join(' AND ')})`;
    return await db.request(query, params);
  };

  const validateIds = record => {
    return record.house_ref && record.person_no
  };

  const processRecords = records => {
    return records.filter(record => validateIds(record)).map(record => {
      return buildSearchRecord({
        id: `${record.house_ref.trim()}/${record.person_no}`,
        firstName: record.forename,
        lastName: record.surname,
        dob: record.dob,
        nino: record.ni_no,
        address: record.address,
        postcode: record.postcode,
        source: Systems.UHT_CONTACTS,
        links: {
          uhContact: record.con_key
        }
      })
    })
  };

  return {
    execute: async queryParams => {
      const records = await search(queryParams);
      return processRecords(records);
    }
  };
}