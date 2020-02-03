const path = require('path');
const { Systems } = require('../../Constants');
const { loadSQL } = require('../../Utils');

const { fetchCustomerSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;

  const fetchCustomer = async id => {
    const params = { id: 'customer_id', type: 'NVarChar', value: id };
    return await db.any(fetchCustomerSQL, params);
  };

  const processResults = function(results) {
    let grouped = results.reduce((acc, result) => {
      if (!acc[result.customer_id]) acc[result.customer_id] = [];
      acc[result.customer_id].push(result);
      return acc;
    }, {});
    let groups = Object.values(grouped);

    return groups.map(group => {
      return {
        id: group[0].customer_id,
        firstName: group[0].first_name,
        lastName: group[0].last_name,
        source: Systems.SINGLEVIEW,
        links: group
      };
    });
  };

  return async id => {
    try {
      const results = await fetchCustomer(id);
      return processResults(results)[0];
    } catch (err) {
      console.log(`Error fetching customer record in SingleView: ${err}`);
    }
  };
};
