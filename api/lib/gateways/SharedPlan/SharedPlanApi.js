const rp = require('request-promise');

class SharedPlanApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async create({ customer, token }) {
    const response = await rp(`${this.baseUrl}/plans`, {
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

  async find({ firstName, lastName, systemIds, token }) {
    const response = await rp(`${this.baseUrl}/plans`, {
      method: 'GET',
      auth: { bearer: token },
      json: true,
      qs: {
        firstName,
        lastName,
        systemIds
      }
    });

    return { planIds: response };
  }
}

module.exports = SharedPlanApi;
