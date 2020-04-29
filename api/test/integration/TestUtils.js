const rp = require('request-promise');
const BASE_URL = 'http://localhost:3010';

let TestUtils = {
  doGetRequest: async function(uri) {
    const options = {
      uri: `${BASE_URL}/${uri}`,
      qs: {},
      json: true
    };
    return await rp(options);
  },
  doPostRequest: async function(uri, body) {
    const options = {
      method: 'POST',
      uri: `${BASE_URL}/${uri}`,
      body,
      json: true
    };
    return await rp(options);
  },
  doDeleteRequest: async function(uri) {
    const options = {
      method: 'DELETE',
      uri: `${BASE_URL}/${uri}`
    };
    return await rp(options);
  }
};

module.exports = TestUtils;
