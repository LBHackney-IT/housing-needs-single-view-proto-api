const rp = require('request-promise');

class VulnerabilitiesApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async create({ customer, token }) {
    const response = await rp(`${this.baseUrl}/api/snapshots`, {
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
      const response = await rp(`${this.baseUrl}/api/snapshots/find`, {
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
        snapshotIds: []
      };
    }
  }
}

module.exports = VulnerabilitiesApi;
