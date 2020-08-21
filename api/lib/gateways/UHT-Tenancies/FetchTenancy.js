const path = require('path');
const { loadSQL, checkString } = require('../../Utils');

const { fetchTenancySQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const logger = options.logger;

  async function fetchTenancy(tag_ref) {
    return (
      await db.request(fetchTenancySQL, [
        { id: 'tag_ref', type: 'NVarChar', value: tag_ref }
      ])
    )[0];
  }

  const processTenancy = function(results) {
    return {
      id: checkString(results.tag_ref),
      address: checkString(results.address1),
      postCode: checkString(results.post_code),
      type: checkString(results.tenure),
      startDate: results.cot,
      endDate: results.eot
    };
  };

  return {
    execute: async id => {
      try {
        const tenancy = await fetchTenancy(id);
        return processTenancy(tenancy);
      } catch (err) {
        logger.error(`Error fetching tenancy in UHT-Tenancies: ${err}`, err);
      }
      return [];
    }
  };
};
