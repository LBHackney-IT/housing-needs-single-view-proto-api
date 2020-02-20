const merge = require('@brikcss/merge');
const { filterArray, compareDate } = require('./Utils');

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
  const sorted_tenancies = merged.tenancies.sort(compareDate);
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
const mergeHousingRegister = records => {
  let result = [];
  records
    .filter(r => r.housingRegister)
    .forEach(r => {
      if (r.housingRegister.applicationRef) result.push(r.housingRegister);
      else result = result.concat(r.housingRegister);
    });
  return result;
};
// Merge and tidy response upjects from multiple backends
const MergeResponses = function(responses) {
  const mergedHousingRegister = mergeHousingRegister(responses);
  let merged = merge(...responses);
  if (merged.tenancies) merged.tenancies = sortMergedTenancies(merged);
  if (merged.address) merged.address = mergeAddresses(merged.address);
  merged.housingRegister = mergedHousingRegister.sort(compareDate);
  filterArrays(merged);
  return merged;
};

module.exports = MergeResponses;
