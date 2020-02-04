const path = require('path');
const { loadSQL } = require('../../Utils');

const { fetchSystemIdSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  db = options.db;
  return {
    getSystemId: async (name, id) => {
      return await db.any(fetchSystemIdSQL, [id, name]);
    }
  };
};
