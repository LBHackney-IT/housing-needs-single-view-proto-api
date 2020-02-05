const dbConfig = {
  dbUrl: process.env.UHW_DB
};

const SqlServerConnection = require('../../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);
const options = { db };

const Backend = {
  fetchCustomerRecord: require('./FetchRecord')(options),
  fetchCustomerNotes: require('./FetchNotes')(options)
};

module.exports = Backend;
