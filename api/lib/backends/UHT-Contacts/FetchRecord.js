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

async function fetchCustomer(id, db) {
  const [house_ref, person_no] = id.split('/');

  const records = await db.request(fetchCustomerSQL, [
    { id: 'house_ref', type: 'NVarChar', value: house_ref },
    { id: 'person_no', type: 'Int', value: person_no }
  ]);

  console.log(`BLAH ${house_ref} ${person_no}. RECS: ${records.length}`);

  return records;
}

let processCustomer = function(result) {
  //const addresses = result.map(record => { return {source: Systems.UHT_CONTACTS, address: formatAddress(record.address)} });
  let customer = {
    systemIds: {
      uhtContacts: result[0].member_sid.toString(),
      householdRef: result[0].house_ref,
      rent: checkString(result[0].tag_ref)
    },
    name: [
      {
        first: nameCase(result[0].forename),
        last: nameCase(result[0].surname),
        title: nameCase(result[0].title)
      }
    ],
    dob: [result[0].dob ? formatRecordDate(result[0].dob) : null],
    phone: [
      formatPhone(result[0].con_phone1),
      formatPhone(result[0].con_phone2),
      formatPhone(result[0].con_phone3)
    ].filter(x => x),
    address: [
      {
        source: Systems.UHT_CONTACTS,
        address: formatAddress(result[0].address)
      }
    ],
    postcode: [checkString(result[0].postcode)],
    nino: [upperCase(result[0].ni_no)]
  };

  let tenancies = result.map(result => {
    if (result.tag_ref) {
      return {
        tagRef: checkString(result.tag_ref),
        startDate: result.start_date
          ? formatRecordDate(result.start_date)
          : null,
        endDate: result.end_date ? formatRecordDate(result.end_date) : null,
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
  });
  // customer.tenancies = { current: [], previous: [] };

  customer.tenancies = tenancies.map(t => {
    // if (t.endDate.includes('1900-01-01')) {
    //   // It is the current tenancy
    //   t.endDate = null;
    //   customer.tenancies.current.push(t);
    // } else {
    //   // It is an old tenancy`
    //   customer.tenancies.previous.push(t);
    // }

    if (t.endDate.includes('1900-01-01')) {
      t.endDate = null;
    }
    return t;
  });

  return customer;
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const customer = await fetchCustomer(id, db);
      return processCustomer(customer);
    } catch (err) {
      console.log(`Error fetching customers in UHT-Contacts: ${err}`);
    }
  };
};
