const path = require('path');
const PostgresDb = require('../PostgresDb');
const { Systems } = require('../Constants');
const {
  loadSQL
} = require('../Utils');

const { 
  customerSearchSQL,
  fetchCustomerSQL } = loadSQL(path.join(__dirname, 'sql'));

let processResults = function(results) {
  let grouped = results.reduce((acc, result) => {
    if (!acc[result.customer_id]) acc[result.customer_id] = [];
    acc[result.customer_id].push(result);
    return acc;
  }, {});
  let groups = Object.values(grouped);

  return groups.map(group => {
    return {
      id: group[0].customer_id,
      firstName: group[0].first_name,
      lastName: group[0].last_name,
      source: Systems.SINGLEVIEW,
      links: group
    };
  });
};

let Backend = {
  customerSearch: async function(queryParams) {
    try {
      let whereClause = [];
      let params = {};

      if (queryParams.firstName && queryParams.firstName !== '') {
        whereClause.push('first_name ILIKE ${firstName}');
        params.firstName = `%${queryParams.firstName}%`;
      }

      if (queryParams.lastName && queryParams.lastName !== '') {
        whereClause.push('last_name ILIKE ${lastName}');
        params.lastName = `%${queryParams.lastName}%`;
      }

      let query = `${customerSearchSQL} WHERE (${whereClause.join(' AND ')})`;
      let customers = await PostgresDb.any(query, params);

      return processResults(customers);
    } catch (err) {
      console.log(`Error searching linked records in SingleView: ${err}`);
    }
  },

  fetchCustomer: async function(id) {
    try {
      let query = `fetchCustomerSQL,{ id : 'customer_id',  type: 'NVarChar', value: id }`
      let customers = await PostgresDb.any(query);

      return processResults(customers)[0];
    } catch (err) {
      console.log(`Error fetching customer record in SingleView: ${err}`);
    }
  },

  fetchCustomerNotes: async function() {
    return Promise.resolve([]);
  },

  fetchCustomerDocuments: async function() {
    return Promise.resolve([]);
  }
};

module.exports = Backend;
