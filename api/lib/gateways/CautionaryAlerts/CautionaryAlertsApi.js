const rp = require('request-promise');

class CautionaryAlertsApi {
  constructor({ baseUrl, apiKey, logger }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.logger = logger;
  }

  async getAlertsForProperty(propertyRef) {
    try {
      const response = await rp(
        `${this.baseUrl}/api/v1/cautionary-alerts/properties/${propertyRef}`,
        {
          method: 'GET',
          headers: {
            'X-API-Key': this.apiKey
          },
          json: true
        }
      );
      return response;
    } catch (err) {
      this.logger.error(
        `Error getting cautionary alerts for property: ${err}`,
        err
      );
      return {
        alerts: []
      };
    }
  }

  async searchPeopleAlerts({tagRef, personNumber}) {
    try {
      const response = await rp(
        `${this.baseUrl}/api/v1/cautionary-alerts/people`,
        {
          method: 'GET',
          headers: {
            'X-API-Key': this.apiKey
          },
          json: true,
          qs: {
            tag_ref: tagRef,
            person_number: personNumber
          }
        }
      );
      return response;
    } catch (err) {
      this.logger.error(
        `Error getting cautionary alerts for people: ${err}`,
        err
      );
      return {
        contacts: []
      };
    }
  }
}

module.exports = CautionaryAlertsApi;
