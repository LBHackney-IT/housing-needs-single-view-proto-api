const dbConfig = {
  dbUrl: process.env.UHW_DB
};

const SqlServerConnection = require('../../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);
const options = { db };

const Backend = {
  customerSearch: require('./Search')(options),
  fetchCustomerRecord: require('./FetchRecord')(options),
  fetchCustomerNotes: require('./FetchNotes')(options),
  fetchCustomerDocuments: require('./FetchDocuments')(options)
};

module.exports = Backend;
