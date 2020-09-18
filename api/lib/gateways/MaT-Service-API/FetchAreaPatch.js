const rp = require('request-promise');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiToken = options.apiToken;

  return {
    execute: async (uprn, postcode) => {
      return await rp(`${baseUrl}/api/properties/${uprn}/patch?${postcode}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`
        },
        json: true
      }).then(response => {
        return response;
      });
    }
  };
};
