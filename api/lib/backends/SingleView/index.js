const db = require('../../PostgresDb');
const options = { db };

const Backend = {
  createRecord: require('./CreateRecord')(options)
};

module.exports = Backend;
