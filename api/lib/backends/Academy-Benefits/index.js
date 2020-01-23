let dbConfig = {
  dbUrl: process.env.ACADEMY_DB
};

const SqlServerConnection = require('../../SqlServerConnection');
console.log(dbConfig);
const db = new SqlServerConnection(dbConfig);
const options = { db };

let Backend = {
  customerSearch: require('./Search')(options),
  fetchCustomerRecord: require('./FetchRecord')(options),
  fetchCustomerNotes: require('./FetchNotes')(options),
  fetchCustomerDocuments: require('./FetchDocuments')(options)
};

module.exports = Backend;
