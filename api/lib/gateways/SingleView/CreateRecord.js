const path = require('path');
const moment = require('moment');
const { loadSQL } = require('../../Utils');
const { createCustomerSQL, createCustomerLinksSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

module.exports = options => {
  const db = options.db;
  const logger = options.logger;

  return {
    execute: async records => {
      try {
        const customer = await db.one(createCustomerSQL);

        await db.task(t => {
          const tp = records
            .filter(r => r !== null)
            .map(r => {
              return t.none(createCustomerLinksSQL, [
                customer.id,
                r.source,
                r.id.toString(),
                r.firstName,
                r.lastName,
                r.address,
                r.dob ? moment(r.dob, 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                r.nino
              ]);
            });

          return Promise.all(tp);
        });
        return customer;
      } catch (err) {
        logger.error(
          `Could not add a customer because of an error: ${err}`,
          err
        );
      }
    }
  };
};
