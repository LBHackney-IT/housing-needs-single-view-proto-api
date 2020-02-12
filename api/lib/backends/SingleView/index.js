const db = require('../../PostgresDb');
const options = { db };

const Backend = {
  createRecord: require('./CreateRecord')(options),
  fetchCustomerRecord: require('./FetchRecord')(options)
};

module.exports = Backend;
