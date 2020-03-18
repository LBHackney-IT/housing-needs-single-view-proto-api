const PostgresDb = require('./PostgresDb');
const { Systems } = require('./Constants');

const backends = {
  [Systems.SINGLEVIEW]: require('./backends/SingleView')
};

const QueryHandler = {
  saveCustomer: async records => {
    return await backends[Systems.SINGLEVIEW].createRecord(records);
  },

  deleteCustomer: async id => {
    const removeLinksQuery =
      'DELETE FROM customer_links WHERE customer_id = ${id}';
    const removeCustomerQuery = 'DELETE FROM customers WHERE id = ${id}';

    await PostgresDb.none(removeLinksQuery, { id });
    return await PostgresDb.none(removeCustomerQuery, { id });
  },

  fetchCustomer: async id => {
    return await backends[Systems.SINGLEVIEW].fetchCustomer(id);
  }
};

module.exports = QueryHandler;
