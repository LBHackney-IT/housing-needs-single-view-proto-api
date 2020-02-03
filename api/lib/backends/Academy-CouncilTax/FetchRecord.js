const path = require('path');
const { checkString, nameCase, formatAddress, loadSQL } = require('@lib/Utils');
const { Systems } = require('@lib/Constants');
const { fetchCustomerSQL, fetchCustomerTransactionsSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

const fetchCustomer = async (id, db) => {
  return (
    await db.request(fetchCustomerSQL, [
      { id: 'account_ref', type: 'NVarChar', value: id.slice(0, 8) }
    ])
  )[0];
};

const fetchCustomerTransactions = async (id, db) => {
  return await db.request(fetchCustomerTransactionsSQL, [
    { id: 'account_ref', type: 'NVarChar', value: id.slice(0, 8) }
  ]);
};

const processCustomer = record => {
  return {
    systemIds: {
      academyCouncilTax: [`${record.account_ref}${record.account_cd}`]
    },
    name: [
      {
        first: nameCase(record.lead_liab_forename),
        last: nameCase(record.lead_liab_surname),
        title: nameCase(record.lead_liab_title)
      }
    ],
    address: [
      {
        source: `${Systems.ACADEMY_COUNCIL_TAX}-Property`,
        address: formatAddress([
          record.addr1,
          record.addr2,
          record.addr3,
          record.addr4,
          record.postcode
        ])
      },
      {
        source: `${Systems.ACADEMY_COUNCIL_TAX}-Forwarding-Address`,
        address: formatAddress([
          record.for_addr1,
          record.for_addr2,
          record.for_addr3,
          record.for_addr4,
          record.for_postcode
        ])
      }
    ],
    postcode: [checkString(record.for_postcode)],
    councilTax: {
      accountBalance: record.account_balance,
      paymentMethod: record.payment_method
    }
  };
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const [customerResult, transactionsResults] = await Promise.all([
        fetchCustomer(id, db),
        fetchCustomerTransactions(id, db)
      ]);

      const customer = processCustomer(customerResult);
      customer.councilTax['transactions'] = transactionsResults;

      return customer;
    } catch (err) {
      console.log(`Error fetching customers in Academy-CouncilTax: ${err}`);
    }
  };
};
