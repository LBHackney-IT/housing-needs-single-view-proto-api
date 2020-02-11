const path = require('path');
const { loadSQL } = require('../../Utils');

const { fetchSystemIdSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  return {
    execute: async (name, id) => {
      const results = await db.any(fetchSystemIdSQL, [id, name]);
      if (results.length) return results.map(result => result.remote_id);
    }
  };
};
