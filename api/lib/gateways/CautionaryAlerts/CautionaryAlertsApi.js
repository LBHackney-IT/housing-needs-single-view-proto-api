const rp = require('request-promise');

module.exports = options => {
  const logger = options.logger;
  const baseUrl = options.baseUrl;
  const apiToken = options.apiToken;

  const alertsForProperty = async propertyRef => {
    try {
      const response = await rp(
        `${baseUrl}/api/v1/cautionary-alerts/properties/${propertyRef}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}` //Use Lambda authoriser
          },
          json: true
        }
      );
      return response;
    } catch (err) {
      logger.error(`Error getting cautionary alerts for property: ${err}`, err);
      return {
        alerts: []
      };
    }
  };

  const alertsForPeople = async (tagRef, personNumber) => {
    try {
      const response = await rp(`${baseUrl}/api/v1/cautionary-alerts/people`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}` //Use Lambda authoriser
        },
        json: true,
        qs: {
          tag_ref: tagRef,
          person_number: personNumber
        }
      });
      return response;
    } catch (err) {
      logger.error(`Error getting cautionary alerts for people: ${err}`, err);
      return {
        contacts: []
      };
    }
  };

  return {
    alertsForProperty,
    alertsForPeople
  };
};
