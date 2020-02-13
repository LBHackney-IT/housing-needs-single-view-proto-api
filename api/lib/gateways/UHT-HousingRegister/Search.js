const path = require('path');
const { Systems } = require('../../Constants');
const { loadSQL } = require('../../Utils');
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
        value: `%${queryParams.firstName.toLowerCase().trim()}%`
      });
      whereClause.push(
        'forename collate SQL_Latin1_General_CP1_CI_AS LIKE @forename'
      );
    }
    if (queryParams.lastName && queryParams.lastName !== '') {
      params.push({
        id: 'surname',
        type: 'NVarChar',
        value: `%${queryParams.lastName.toLowerCase().trim()}%`
      });
      whereClause.push(
        'surname collate SQL_Latin1_General_CP1_CI_AS LIKE @surname'
      );
    }

    whereClause = whereClause.map(clause => `(${clause})`);

    const query = `${searchCustomersBaseSQL} WHERE (${whereClause.join(
      ' AND '
    )})`;
    return await db.request(query, params);
  };

  const processRecords = records => {
    return records
      .filter(record => validateIds(record))
      .map(record => {
        return buildSearchRecord({
          id: `${record.app_ref.trim()}/${record.person_no}`,
          firstName: record.forename,
          lastName: record.surname,
          dob: record.dob,
          nino: record.ni_no,
          address: record.corr_addr,
          postcode: record.post_code,
          source: Systems.UHT_HOUSING_REGISTER,
          links: {
            uhContact: record.con_key
          }
        });
      });
  };

  const validateIds = record => {
    return record.app_ref && record.person_no;
  };

  return {
    execute: async queryParams => {
      try {
        const records = await search(queryParams);
        return processRecords(records);
      } catch (err) {
        console.log(`Error searching customers in UHT-HousingRegister: ${err}`);
        return [];
      }
    }
  };
};
