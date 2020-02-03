const dbConfig = {
  dbUrl: process.env.ACADEMY_DB
};

const SqlServerConnection = require('@lib/SqlServerConnection');
const db = new SqlServerConnection(dbConfig);
const options = { db };

const Backend = {
  fetchCustomerRecord: require('./FetchRecord')(options),
  fetchCustomerNotes: require('./FetchNotes')(options),
  fetchCustomerDocuments: require('./FetchDocuments')(options)
};

module.exports = Backend;
