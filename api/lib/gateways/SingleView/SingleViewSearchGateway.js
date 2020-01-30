const path = require('path');
const { Systems } = require('../../Constants');
const { loadSQL } = require('../../Utils');

const { customerSearchSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildSearchRecord = options.buildSearchRecord;

  const search = async queryParams => {
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

  const validateIds = record => {
    return record[0].customer_id;
  };

  const processRecords = records => {
    let grouped = records.reduce((acc, record) => {
      if (!acc[record.customer_id]) acc[record.customer_id] = [];
      acc[record.customer_id].push(record);
      return acc;
    }, {});
    let groups = Object.values(grouped);

    return groups
      .filter(group => validateIds(group))
      .map(group => {
        return buildSearchRecord({
          id: group[0].customer_id,
          firstName: group[0].first_name,
          lastName: group[0].last_name,
          source: Systems.SINGLEVIEW,
          links: group
        });
      });
  };

  return {
    execute: async queryParams => {
      try {
        const results = await search(queryParams);
        return processRecords(results);
      } catch (err) {
        console.log(`Error searching linked records in SingleView: ${err}`);
        return [];
      }
    }
  };
};
