const rp = require('request-promise');
const { Systems } = require('../../Constants');
const {
  checkString,
  nameCase,
  formatAddress,
  formatRecordDate,
  upperCase
} = require('../../Utils');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiKey = options.apiKey;
  const apiToken = options.apiToken;

  let processCustomer = function(record) {
    return {
      systemIds: {
        academyBenefits: [`${record.claimId}${record.checkDigit}`]
      },
      name: [
        {
          first: nameCase(record.firstName),
          last: nameCase(record.lastName),
          title: nameCase(record.title)
        }
      ],
      dob: [formatRecordDate(record.dateOfBirth)],
      address: [
        {
          source: Systems.ACADEMY_BENEFITS,
          address: formatAddress([
            record.claimantAddress.addressLine1,
            record.claimantAddress.addressLine2,
            record.claimantAddress.addressLine3,
            record.claimantAddress.addressLine4,
            record.claimantAddress.postcode
          ])
        }
      ],
      nino: [upperCase(record.niNumber)],
      postcode: [checkString(record.claimantAddress.postcode)],
      benefits: {
        live: record.statusIndicator == 1
      }
    };
  };

  const callApi = async (claimId, personRef) => {
    return await rp(`${baseUrl}/api/v1/claim/${claimId}/person/${personRef}`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey, //Use API Gateway authorisation
        'Authorization': apiToken //Use lambda authoriser
      },
      json: true
    });
  };

  return {
    execute: async (claimId, personRef) => {
      let response = await callApi(claimId, personRef);
      return processCustomer(response);
    }
  };
};
