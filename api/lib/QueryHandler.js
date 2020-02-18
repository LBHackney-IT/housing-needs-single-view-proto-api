const PostgresDb = require('./PostgresDb');
const { Systems } = require('./Constants');
const merge = require('@brikcss/merge');
const { filterArray, compareDateStrings } = require('./Utils');

const backends = {
  [Systems.UHT_CONTACTS]: require('./backends/UHT-Contacts'),
  [Systems.UHT_HOUSING_REGISTER]: require('./backends/UHT-HousingRegister'),
  [Systems.UHW]: require('./backends/UHW'),
  [Systems.ACADEMY_BENEFITS]: require('./backends/Academy-Benefits'),
  [Systems.ACADEMY_COUNCIL_TAX]: require('./backends/Academy-CouncilTax'),
  [Systems.JIGSAW]: require('./backends/Jigsaw'),
  [Systems.SINGLEVIEW]: require('./backends/SingleView')
};

const cleanRecord = require('./use-cases/CleanRecord')({
  badData: {
    address: ['10 Elmbridge Walk, Blackstone Estate, London, E8 3HA'],
    dob: ['01/01/1900']
  }
});

let getCustomerLinks = async function(id) {
  const query = `
    SELECT customer_links.remote_id, systems.name FROM customer_links, customers, systems 
    WHERE systems.id = customer_links.system_id AND customers.id = customer_links.customer_id AND customers.id = $1`;
  return await PostgresDb.any(query, [id]);
};

// Recursively filter duplicates from arrays in objects
let filterArrays = function(input) {
  for (let key in input) {
    if (Array.isArray(input[key])) {
      input[key] = filterArray(input[key]);
    } else if (typeof input[key] === 'object') {
      filterArrays(input[key]);
    }
  }
};

let mergeAddresses = function(addresses) {
  // Remove empty addresses
  addresses = addresses.filter(addr => addr.address.length > 0);

  // reducer lambda to group by address
  let group = (acc, address) => {
    let key = JSON.stringify(address.address);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(address);
    return acc;
  };

  // group by address
  let grouped = addresses.reduce(group, {});

  // flatten back into an array with the sources as an array in each object
  return Object.values(grouped).map(arr => {
    try {
      return {
        source: arr
          .map(addr => addr.source) // Pull out the sources into an array and deduplicate
          .filter((value, index, self) => {
            return self.indexOf(value) === index;
          }),
        address: arr[0].address
      };
    } catch (err) {
      console.error('Error merging addresses');
      console.error(err);
      return {};
    }
  });
};

const sortMergedTenancies = merged => {
  const sorted_tenancies = merged.tenancies.sort(compareDateStrings);
  const tenancies = { current: [], previous: [] };
  sorted_tenancies.map(t => {
    if (t.endDate === null && tenancies.current.length === 0) {
      tenancies.current.push(t);
    } else {
      tenancies.previous.push(t);
    }
  });
  return tenancies;
};
mergeHousingRegister = records => {
  const result = [];
  records.map(record => {
    if (record.housingRegister) result.push(record.housingRegister);
  });

  return result;
};
// Merge and tidy response upjects from multiple backends
let mergeResponses = function(responses) {
  const mergedHousingRegister = mergeHousingRegister(responses);
  let merged = merge(...responses);
  if (merged.tenancies) merged.tenancies = sortMergedTenancies(merged);
  if (merged.address) merged.address = mergeAddresses(merged.address);
  merged.housingRegister = mergedHousingRegister.sort(compareDateStrings);
  filterArrays(merged);
  return merged;
};

const QueryHandler = {
  saveCustomer: async records => {
    return await backends[Systems.SINGLEVIEW].createRecord(records);
  },

  deleteCustomer: async id => {
    const removeLinksQuery =
      'DELETE FROM customer_links WHERE customer_id = ${id}';
    const removeCustomerQuery = 'DELETE FROM customers WHERE id = ${id}';

    await PostgresDb.none(removeLinksQuery, { id });
    return await PostgresDb.none(removeCustomerQuery, { id });
  },

  fetchCustomer: async id => {
    return await backends[Systems.SINGLEVIEW].fetchCustomer(id);
  },

  fetchCustomerRecord: async id => {
    const links = await getCustomerLinks(id);
    let requests = links.map(async link =>
      backends[link.name].fetchCustomerRecord(link.remote_id)
    );

    const results = await Promise.all(requests);
    let customer = mergeResponses(results);

    if (!customer.housingRegister) {
      customer.housingRegister = {};
    }

    if (!customer.housingNeeds) {
      customer.housingNeeds = {};
    }

    return cleanRecord(customer);
  }
};

module.exports = QueryHandler;
