const path = require('path');
const { nameCase, formatRecordDate, loadSQL } = require('../../Utils');
const { fetchCustomerBenefitsSQL, fetchCustomerHouseholdSQL } = loadSQL(
  path.join(__dirname, 'sql')
);
const { IncomeFrequency } = require('../../Constants');
const isEqualWith = require('lodash/isEqualWith');

async function fetchCustomerDb(claim_id, person_ref, fetchDB, logger) {
  try {
    return await fetchDB.execute(claim_id, person_ref);
  } catch (err) {
    logger.error(`Error fetching customers in Academy-Benefits: ${err}`, err);
  }
}

async function fetchCustomerAPI(claim_id, person_ref, fetchAPI, logger) {
  try {
    return await fetchAPI.execute(claim_id, person_ref);
  } catch (err) {
    logger.error(
      `Error fetching customers in Academy-Benefits API: ${err}`,
      err
    );
  }
}

async function fetchCustomer(id, fetchDB, fetchAPI, logger) {
  const [claim_id, person_ref] = id.split('/');
  const customer = await fetchCustomerDb(claim_id, person_ref, fetchDB, logger);
  const customerAPI = await fetchCustomerAPI(
    claim_id,
    person_ref,
    fetchAPI,
    logger
  );
  if (recordEquality(customer, customerAPI)) {
    logger.log(
      'Academy records retrieved from the API and the DB are identical'
    );
  } else {
    logger.log('Academy API and DB have returned different record');
    logger.log({ 'DB record': customer });
    logger.log({ 'API record': customerAPI });
  }
  return customer;
}

const recordEquality = (record1, record2) => {
  if (!record1 || !record2) return false;
  return (
    record1.claim_id === record2.claim_id &&
    isEqualWith(record1.name, record2.name, stringDataEquality) &&
    isEqualWith(record1.nino, record2.nino, stringDataEquality) &&
    isEqualWith(record1.postcode, record2.postcode, stringDataEquality) &&
    isEqualWith(record1.systemIds, record2.systemIds, stringDataEquality)
  );
};

const stringDataEquality = (string1, string2) => {
  if (typeof string1 === 'string') {
    if (string1 === string2) return true;
    if (!string1 || !string2) return false;

    return string1.toLowerCase().trim() === string2.toLowerCase().trim();
  }
};

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
  const fetchDB = options.fetchDB;
  const fetchAPI = options.fetchAPI;
  const logger = options.logger;
  const db = options.db;

  return {
    execute: async id => {
      try {
        const [customer, benefitsResults, household] = await Promise.all([
          fetchCustomer(id, fetchDB, fetchAPI, logger),
          fetchBenefits(id, db),
          fetchHousehold(id, db)
        ]);
        customer.benefits.income = processBenefits(benefitsResults);
        if (household.length > 0)
          customer.household = processHousehold(household);
        return customer;
      } catch (err) {
        logger.error(
          `Error fetching customers in Academy-Benefits: ${err}`,
          err
        );
      }
    }
  };
};
