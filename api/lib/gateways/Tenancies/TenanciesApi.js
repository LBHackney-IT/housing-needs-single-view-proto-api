const rp = require('request-promise');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const token = options.token;
  const logger = options.logger;

  const makeSearchRequest = async (query, cursor) => {
    return await rp(`${baseUrl}/api/v1/tenancies`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: true,
      qs: {
        limit: 1000,
        cursor,
        address: query.address,
        freehold_only: query.freehold_only,
        leasehold_only: query.leasehold_only
      }
    });
  };

  const search = async query => {
    try {
      let response = await makeSearchRequest(query);
      let tenancies = response.tenancies;

      while (response.nextCursor) {
        response = await makeSearchRequest(query, response.nextCursor);
        tenancies = [...tenancies, ...response.tenancies];
      }
      return { tenancies: tenancies };
    } catch (err) {
      logger.error(
        `Search tenancies: Error calling the tenancy API. ${err.message}`,
        err
      );
      return { tenancies: [] };
    }
  };

  return { search };
};
