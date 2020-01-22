let dbConfig = {
  user: process.env.Academy_user,
  password: process.env.Academy_password,
  server: process.env.Academy_server,
  database: process.env.Academy_database,
  requestTimeout: 60000
};

const SqlServerConnection = require('../../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);
const options = { db };

let Backend = {
  customerSearch: require('./Search')(options),
  fetchCustomerRecord: require('./FetchRecord')(options),
  fetchCustomerNotes: require('./FetchNotes')(options),
  fetchCustomerDocuments: require('./FetchDocuments')(options)
};

module.exports = Backend;
