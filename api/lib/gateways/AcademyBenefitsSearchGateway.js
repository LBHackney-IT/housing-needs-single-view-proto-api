const path = require('path');
const { loadSQL } = require('../Utils');
const { Systems } = require('../Constants');
const { searchCustomersBaseSQL } = loadSQL(
  path.join(__dirname, '../sql/AcademyBenefits')
);

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
    const query = `${searchCustomersBaseSQL} AND(${whereClause.join(' AND ')})`;
    return await db.request(query, params);
  };

  const validateIds = record => {
    return record.claim_id && record.check_digit && record.person_ref;
  };

  const processRecords = records => {
    return records
      .filter(record => validateIds(record))
      .map(record => {
        return buildSearchRecord({
          id: `${record.claim_id}${record.check_digit}/${record.person_ref}`,
          firstName: record.forename,
          lastName: record.surname,
          dob: record.birth_date,
          nino: record.nino,
          addr1: record.addr1,
          addr2: record.addr2,
          addr3: record.addr3,
          addr4: record.addr4,
          postcode: record.post_code,
          source: Systems.ACADEMY_BENEFITS,
          links: {
            hbClaimId: record.claim_id
          }
        });
      });
  };

  return {
    execute: async queryParams => {
      const records = await search(queryParams);
      return processRecords(records);
    }
  };
};
