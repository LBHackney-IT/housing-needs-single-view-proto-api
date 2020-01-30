const path = require('path');
const { loadSQL } = require('../../Utils');
const { createCustomerSQL, createCustomerLinksSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

module.exports = options => {
  const db = options.db;

  return async records => {
    const customer = await db.one(createCustomerSQL);

    await db.task(t => {
      const tp = records
        .filter(r => r !== null)
        .map(r => {
          return t.none(createCustomerLinksSQL, {
            customer_id: customer.id,
            system_name: r.source,
            remote_id: r.id.toString(),
            first_name: r.firstName,
            last_name: r.lastName,
            address: r.address,
            dob: r.dob
              ? moment(r.dob, 'DD/MM/YYYY').format('YYYY-MM-DD')
              : null,
            nino: r.nino
          });
        });

      return Promise.all(tp);
    });
    return customer;
  };
};
