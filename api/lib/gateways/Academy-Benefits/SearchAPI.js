const rp = require('request-promise');
const { Systems } = require('../../Constants');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiKey = options.apiKey;
  const buildSearchRecord = options.buildSearchRecord;

  const validateIds = record => {
    return record.claimId && record.checkDigit && record.personRef;
  };

  const processRecords = records => {
    return records
      .filter(record => validateIds(record))
      .map(record => {
        return buildSearchRecord({
          id: `${record.claimId}${record.checkDigit}/${record.personRef}`,
          firstName: record.firstName,
          lastName: record.lastName,
          dob: record.dateOfBirth,
          nino: record.niNumber,
          address: [
            record.addressLine1,
            record.addressLine2,
            record.addressLine3,
            record.addressLine4,
            record.postcode
          ],
          postcode: record.postcode,
          source: Systems.ACADEMY_BENEFITS,
          links: {
            hbClaimId: record.claimId
          }
        });
      });
  };

  const callApi = async (queryParams, cursor) => {
    return await rp(`${baseUrl}/api/v1/claimants`, {
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
  }

  const search = async (queryParams) => {
    let response = await callApi(queryParams);
    let claimants = response.claimants;

    while (response.nextCursor) {
      response = await callApi(queryParams, response.nextCursor)
      claimants = [...claimants, ...response.claimants]
    }
    return processRecords(claimants);
  }

  return {
    execute: search
  }
}