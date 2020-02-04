const path = require('path');
const { loadSQL } = require('../../Utils');

const { getCustomerLinksSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  return {
    execute: async id => {
      return await db.any(getCustomerLinksSQL, [id]);
    }
  };
};
