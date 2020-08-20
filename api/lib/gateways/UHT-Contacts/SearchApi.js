const { Systems } = require('../../Constants');
const rp = require('request-promise');

module.exports = options => {
  const logger = options.logger;
  const apiKey = options.apiKey;
  const baseUrl = options.baseUrl;
  const buildSearchRecord = options.buildSearchRecord;

  const search = async queryParams => {
    let response = await callApi(queryParams);
    let households = response.households;

    while (response.nextCursor) {
      response = await callApi(queryParams, response.nextCursor);
      households = [...households, ...response.households];
    }
    return processRecords(households);
  };

  const validateIds = record => {
    return record.houseReference && record.personNumber;
  };

  const callApi = async (queryParams, cursor) => {
    return await rp(`${baseUrl}/api/v1/households`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey
      },
      json: true,
      qs: {
        first_name: queryParams.firstName,
        last_name: queryParams.lastName,
        cursor: cursor,
        limit: 100
      }
    });
  };
  const processRecords = records => {
    return records
      .filter(record => validateIds(record))
      .map(record => {
        return buildSearchRecord({
          id: `${record.houseReference.trim()}/${record.personNumber}`,
          firstName: record.firstName,
          lastName: record.lastName,
          dob: record.dateOfBirth,
          nino: record.niNumber,
          address: record.address ? record.address.addressLine1 : null,
          postcode: record.address ? record.address.postcode : null,
          source: Systems.UHT_CONTACTS,
          links: {
            uhContact: record.housingWaitingListContactKey
          }
        });
      });
  };

  return {
    execute: async queryParams => {
      try {
        const records = await search(queryParams);
        return records;
      } catch (err) {
        logger.error(
          `Error searching customers in Housing API: ${err.message}`,
          err
        );
        return [];
      }
    }
  };
};
