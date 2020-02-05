const dbConfig = {
  dbUrl: process.env.HN_COMINO_URL
};

const SqlServerConnection = require('../../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);
const options = { db };

const Backend = {
  fetchCustomerNotes: require('./FetchNotes')(options)
};

module.exports = Backend;
