const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersSQL } = loadSQL(path.join(__dirname, 'sql'));

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

    whereClause = whereClause.map(clause => `(${clause})`);
    const query = `${searchCustomersSQL} AND(${whereClause.join(' AND ')})`;
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
          address: [
            record.addr1,
            record.addr2,
            record.addr3,
            record.addr4,
            record.post_code
          ],
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
      try {
        const records = await search(queryParams);
        return processRecords(records);
      } catch (err) {
        console.log(`Error searching customers in Academy-Benefits: ${err}`);
        return [];
      }
    }
  };
};
