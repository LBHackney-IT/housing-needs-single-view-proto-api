const path = require('path');
const {
  checkString,
  nameCase,
  formatRecordDate,
  loadSQL
} = require('../../Utils');
const { fetchCustomerSQL } = loadSQL(path.join(__dirname, 'sql'));

const fetchCustomer = async (id, db) => {
  return (
    await db.request(fetchCustomerSQL, [{ id: 'id', type: 'Int', value: id }])
  )[0];
};

const processCustomer = record => {
  return {
    systemIds: {
      uhw: [record.ContactNo.toString()]
    },
    name: [
      {
        first: nameCase(record.Forenames.trim()),
        last: nameCase(record.Surname.trim()),
        title: nameCase(record.Title)
      }
    ],
    dob: [formatRecordDate(record.DOB)],
    postcode: [checkString(record.PostCode)],
    email: [record.EmailAddress]
  };
};

module.exports = options => {
  const db = options.db;
  const Logger = options.Logger;

  return {
    execute: async id => {
      try {
        const customer = await fetchCustomer(id, db);
        return processCustomer(customer);
      } catch (err) {
        Logger.error(
          `Error fetching customers in UHW: ${err}`,
          err
        );
      }
    }
  };
};
