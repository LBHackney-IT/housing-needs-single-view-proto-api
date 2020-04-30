const path = require('path');
const { loadSQL } = require('../../Utils');

const { fetchCustomerLinksSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const Logger = options.Logger;

  return {
    execute: async id => {
      try {
        return await db.any(fetchCustomerLinksSQL, [id]);
      } catch (err) {
        Logger.error(
          `Could fetch customer links because of an error: ${err}`,
          err
        );
      }
    }
  };
};
