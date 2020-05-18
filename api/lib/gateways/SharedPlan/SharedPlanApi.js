const rp = require('request-promise');

class SharedPlanApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async create({ customer, token }) {
    const response = await rp(`${this.baseUrl}/`, {
      method: 'POST',
      auth: { bearer: token },
      json: true,
      body: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        systemIds: customer.systemIds
      }
    });

    return { id: response.id };
  }
}

module.exports = SharedPlanApi;
