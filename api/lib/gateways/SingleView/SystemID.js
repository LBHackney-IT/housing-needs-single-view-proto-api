const path = require('path');
const { loadSQL } = require('../../Utils');

const { fetchSystemIdSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  return {
    execute: async (name, id) => {
      let result = await db.any(fetchSystemIdSQL, [id, name]);
      result = result[0];
      if (result) return result.remote_id;
    }
  };
};
