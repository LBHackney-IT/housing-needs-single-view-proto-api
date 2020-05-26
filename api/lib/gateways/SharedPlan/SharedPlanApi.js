const rp = require('request-promise');

class SharedPlanApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async create({ customer, token }) {
    const response = await rp(`${this.baseUrl}/api/plans`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
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
    try {
      const response = await rp(`${this.baseUrl}/api/plans/find`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        json: true,
        body: {
          firstName,
          lastName,
          systemIds
        }
      });
      return response;
    } catch (err) {
      return {
        planIds: []
      };
    }
  }
}

module.exports = SharedPlanApi;
