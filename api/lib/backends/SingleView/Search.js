const path = require('path');
const { Systems } = require('../../Constants');
const { loadSQL } = require('../../Utils');

const { customerSearchSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;

  const runSearchQuery = async queryParams => {
    let whereClause = [];
    let params = {};

    if (queryParams.firstName && queryParams.firstName !== '') {
      whereClause.push('first_name ILIKE ${firstName}');
      params.firstName = `%${queryParams.firstName}%`;
    }

    if (queryParams.lastName && queryParams.lastName !== '') {
      whereClause.push('last_name ILIKE ${lastName}');
      params.lastName = `%${queryParams.lastName}%`;
    }

    const query = `${customerSearchSQL} WHERE (${whereClause.join(' AND ')})`;
    return await db.any(query, params);
  };

  const processResults = results => {
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

  return async query => {
    try {
      const results = await runSearchQuery(query);
      return processResults(results);
    } catch (err) {
      console.log(`Error searching linked records in SingleView: ${err}`);
    }
  };
};
