const { Systems } = require('../../Constants');

module.exports = options => {
  const searchDb = options.searchDb;
  const searchAPI = options.searchAPI;
  const buildSearchRecord = options.buildSearchRecord;
  const logger = options.logger;

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
        const dbRecords = await searchDb(queryParams);
        const apiRecords = await searchAPI(queryParams);
        return processRecords(dbRecords);
      } catch (err) {
        logger.error(
          `Error searching customers in Academy-Benefits: ${err}`,
          err
        );
        return [];
      }
    }
  };
};
