const dbConfig = {
  dbUrl: process.env.UHW_DB
};

const SqlServerConnection = require('../../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);
const options = { db };

const Backend = {
  fetchCustomerRecord: require('./FetchRecord')(options)
};

module.exports = Backend;
