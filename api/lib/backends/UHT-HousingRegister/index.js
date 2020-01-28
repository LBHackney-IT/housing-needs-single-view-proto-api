let dbConfig = {
  dbUrl: process.env.UHT_DB
};

const SqlServerConnection = require('../../SqlServerConnection');
const db = new SqlServerConnection(dbConfig);

const options = { db };

module.exports = {
  customerSearch: require('./Search')(options),
  fetchCustomerRecord: require('./FetchRecord')(options),
  fetchCustomerNotes: require('./FetchNotes')(options),
  fetchCustomerDocuments: async () => []
};
