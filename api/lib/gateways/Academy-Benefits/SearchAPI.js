const rp = require('request-promise');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiKey = options.apiKey;

  const search = async (queryParams) => {
    const response = await rp(`${baseUrl}/api/v1/claimants`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey
      },
      json: true,
      qs: { 
        first_name: queryParams.firstName,
        last_name: queryParams.lastName
      } 
    });
    return response.claimants;
  } 
 
  return {
    searchAPI: search
  }
}