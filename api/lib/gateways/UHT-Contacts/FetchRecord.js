const path = require('path');
const {
  formatPhone,
  formatAddress,
  checkString,
  nameCase,
  formatRecordDate,
  upperCase,
  loadSQL
} = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerSQL } = loadSQL(path.join(__dirname, 'sql'));

const fetchCustomer = async (id, db) => {
  const [house_ref, person_no] = id.split('/');

  return await db.request(fetchCustomerSQL, [
    { id: 'house_ref', type: 'NVarChar', value: house_ref },
    { id: 'person_no', type: 'Int', value: person_no }
  ]);
};

const processCustomer = results => {
  let customer = {
    systemIds: {
      uhtContacts: results[0].member_sid.toString(),
      householdRef: results[0].house_ref,
      rent: checkString(results[0].tag_ref),
      paymentRef: results[0].u_saff_rentacc
    },
    name: [
      {
        first: nameCase(results[0].forename),
        last: nameCase(results[0].surname),
        title: nameCase(results[0].title)
      }
    ],
    dob: [results[0].dob ? formatRecordDate(results[0].dob) : null],
    phone: [
      formatPhone(results[0].con_phone1),
      formatPhone(results[0].con_phone2),
      formatPhone(results[0].con_phone3)
    ].filter(x => x),
    address: [
      {
        source: Systems.UHT_CONTACTS,
        address: formatAddress(results[0].address)
      }
    ],
    postcode: [checkString(results[0].postcode)],
    nino: [upperCase(results[0].ni_no)]
  };

  const tenancies = results
    .map(result => {
      if (result.tag_ref) {
        return {
          tagRef: checkString(result.tag_ref),
          startDate: result.start_date,
          endDate: result.end_date,
          tenure: checkString(result.tenure),
          currentBalance: result.current_balance,
          rentAmount: result.rent,
          rentPeriod: result.period,
          propRef: checkString(result.prop_ref),
          address: formatAddress([
            result.post_preamble,
            [checkString(result.post_design), checkString(result.aline1)]
              .filter(x => x)
              .join(' '),
            result.aline2,
            result.aline3,
            result.aline4,
            result.post_code
          ])
        };
      }
    })
    .filter(x => x);

  customer.tenancies = tenancies.map(tenancy => {
    if (tenancy.endDate.getYear() === '1900') {
      tenancy.endDate = null;
    }
    return tenancy;
  });
  return customer;
};

module.exports = options => {
  const db = options.db;

  return {
    execute: async id => {
      try {
        console.log('this thing ' + id);
        const customer = await fetchCustomer(id, db);
        return processCustomer(customer);
      } catch (err) {
        console.log(`Error fetching customers in UHT-Contacts: ${err}`);
      }
    }
  };
};
