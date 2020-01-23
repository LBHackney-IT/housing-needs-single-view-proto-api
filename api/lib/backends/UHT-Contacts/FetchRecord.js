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

  return (await db.request(fetchCustomerSQL, [
    { id: 'house_ref', type: 'NVarChar', value: house_ref },
    { id: 'person_no', type: 'Int', value: person_no }
  ]))[0];
}

let processCustomer = function(result) {
  let customer = {
    systemIds: {
      uhtContacts: [result.member_sid.toString()],
      householdRef: [result.house_ref],
      rent: [checkString(result.tag_ref)]
    },
    name: [
      {
        first: nameCase(result.forename),
        last: nameCase(result.surname),
        title: nameCase(result.title)
      }
    ],
    dob: [result.dob ? formatRecordDate(result.dob) : null],
    phone: [
      formatPhone(result.con_phone1),
      formatPhone(result.con_phone2),
      formatPhone(result.con_phone3)
    ].filter(x => x),
    address: [
      { source: Systems.UHT_CONTACTS, address: formatAddress(result.address) }
    ],
    postcode: [checkString(result.postcode)],
    nino: [upperCase(result.ni_no)]
  };
  if (result.tag_ref) {
    let tenancy = {
      tagRef: checkString(result.tag_ref),
      startDate: result.start_date ? formatRecordDate(result.start_date) : null,
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
    customer.tenancies = { current: [], previous: [] };
    if (tenancy.endDate === '1900-01-01') {
      // It is the current tenancy
      tenancy.endDate = null;
      customer.tenancies.current.push(tenancy);
    } else {
      // It is an old tenancy
      customer.tenancies.previous.push(tenancy);
    }
  }
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
