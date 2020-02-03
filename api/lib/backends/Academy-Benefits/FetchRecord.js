const path = require('path');
const {
  checkString,
  nameCase,
  formatAddress,
  formatRecordDate,
  upperCase,
  loadSQL
} = require('@lib/Utils');
const { Systems, IncomeFrequency } = require('@lib/Constants');
const {
  fetchCustomerSQL,
  fetchCustomerBenefitsSQL,
  fetchCustomerHouseholdSQL
} = loadSQL(path.join(__dirname, 'sql'));

async function fetchCustomer(id, db) {
  const [claim_id, person_ref] = id.split('/');

  return (
    await db.request(fetchCustomerSQL, [
      { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) },
      { id: 'person_ref', type: 'Int', value: person_ref }
    ])
  )[0];
}

async function fetchBenefits(id, db) {
  const claim_id = id.split('/')[0];

  return await db.request(fetchCustomerBenefitsSQL, [
    { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) }
  ]);
}

async function fetchHousehold(id, db) {
  const [claim_id, person_ref] = id.split('/');

  return await db.request(fetchCustomerHouseholdSQL, [
    { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) },
    { id: 'person_ref', type: 'Int', value: person_ref }
  ]);
}

let processCustomer = function(record) {
  return {
    systemIds: {
      academyBenefits: [`${record.claim_id}${record.check_digit}`]
    },
    name: [
      {
        first: nameCase(record.forename),
        last: nameCase(record.surname),
        title: nameCase(record.title)
      }
    ],
    dob: [formatRecordDate(record.birth_date)],
    address: [
      {
        source: Systems.ACADEMY_BENEFITS,
        address: formatAddress([
          record.addr1,
          record.addr2,
          record.addr3,
          record.addr4,
          record.post_code
        ])
      }
    ],
    nino: [upperCase(record.nino)],
    postcode: [checkString(record.post_code)],
    benefits: {
      live: record.status_ind == 1
    }
  };
};

let processHousehold = function(household) {
  return household.map(mem => {
    return {
      title: nameCase(mem.title),
      first: nameCase(mem.first),
      last: nameCase(mem.last),
      dob: formatRecordDate(mem.dob)
    };
  });
};

let processBenefits = function(benefits) {
  return benefits.map(b => {
    return {
      amount: b.amount,
      description: b.description,
      period: IncomeFrequency[b.freq_len],
      frequency: b.freq_period
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const [customerResult, benefitsResults, household] = await Promise.all([
        fetchCustomer(id, db),
        fetchBenefits(id, db),
        fetchHousehold(id, db)
      ]);

      let customer = processCustomer(customerResult);
      customer.benefits.income = processBenefits(benefitsResults);
      if (household.length > 0)
        customer.household = processHousehold(household);

      return customer;
    } catch (err) {
      console.log(`Error fetching customers in Academy-Benefits: ${err}`);
    }
  };
};
