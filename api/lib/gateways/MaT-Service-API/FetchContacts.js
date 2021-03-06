const rp = require('request-promise');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiToken = options.apiToken;

  return {
    execute: async uprn => {
      return await rp(`${baseUrl}/api/contacts?uprn=${uprn}`, {
        method: 'GET',
        headers: {
          Cookie: `hackneyToken=${apiToken};`
        },
        json: true
      }).then(response => {
        return response.contacts;
      });
    }
  };
};
