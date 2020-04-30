const path = require('path');
const { loadSQL } = require('../../Utils');

const { fetchCustomerLinksSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const logger = options.logger;

  return {
    execute: async id => {
      try {
        return await db.any(fetchCustomerLinksSQL, [id]);
      } catch (err) {
        logger.error(
          `Could fetch customer links because of an error: ${err}`,
          err
        );
      }
    }
  };
};
