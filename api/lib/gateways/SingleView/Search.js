const path = require('path');
const { Systems } = require('../../Constants');
const { loadSQL } = require('../../Utils');

const { customerSearchSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildSearchRecord = options.buildSearchRecord;
  const logger = options.logger;

  const search = async queryParams => {
    let whereClause = [];
    let params = {};

    if (queryParams.firstName && queryParams.firstName !== '') {
      whereClause.push('first_name ILIKE ${firstName}');
      params.firstName = `%${queryParams.firstName.trim()}%`;
    }
    if (queryParams.lastName && queryParams.lastName !== '') {
      whereClause.push('last_name ILIKE ${lastName}');
      params.lastName = `%${queryParams.lastName.trim()}%`;
    }

    const query = `${customerSearchSQL} WHERE (${whereClause.join(' AND ')})`;
    return await db.any(query, params);
  };

  const processRecords = records => {
    let grouped = records.reduce((acc, record) => {
      if (!acc[record.customer_id]) acc[record.customer_id] = [];
      acc[record.customer_id].push(record);
      return acc;
    }, {});
    let groups = Object.values(grouped);

    return groups.map(group => {
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
        logger.error(
          `Error searching linked records in SingleView: ${err}`,
          err
        );
        return [];
      }
    }
  };
};
