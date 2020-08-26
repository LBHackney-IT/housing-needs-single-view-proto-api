const rp = require('request-promise');

class CautionaryAlertsApi {
    constructor({ baseUrl, apiKey }) {
      this.baseUrl = baseUrl;
      this.apiKey = apiKey;
    }

    async propertyAlerts(propertyRef) {
        try
        {
            const response = await rp(`${baseUrl}/api/v1/cautionary-alerts/properties/${propertyRef}`, {
                method: 'GET',
                headers: {
                  'X-API-Key': apiKey
                },
                json: true
            });
            return response;
        }  
        catch (err) {
            return { 
                cautionaryIds: []
            };
        };
    }

    async peopleAlerts (tagref, personNumber) {
        return await rp(`${baseUrl}/api/v1/cautionary-alerts/people`, {
            method: 'GET',
            headers: {
              'X-API-Key': apiKey
            },
            json: true,
            qs: {
              tag_ref: tagref,
              person_number: personNumber
          }
      });
    };
}

module.exports = CautionaryAlertsApi;