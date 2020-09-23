const rp = require('request-promise');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiToken = options.apiToken;

  return {
    execute: async (paymentRef, postcode) => {
      return await rp(
        `${baseUrl}/api/v1/transactions/payment-ref/${paymentRef}/post-code/${postcode}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiToken
          },
          json: true
        }
      ).then(response => {
        return response;
      });
    }
  };
};
