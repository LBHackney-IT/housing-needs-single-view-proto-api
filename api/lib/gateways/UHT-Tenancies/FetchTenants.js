const path = require('path');
const { loadSQL, checkString } = require('../../Utils');

const { fetchTenantsSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const logger = options.logger;

  async function fetchTenants(tag_ref) {
    return await db.request(fetchTenantsSQL, [
      { id: 'tag_ref', type: 'NVarChar', value: tag_ref }
    ]);
  }

  const processTenants = function(results) {
    return results.map(result => {
      return {
        title: checkString(result.title),
        forename: checkString(result.forename),
        surname: checkString(result.surname),
        dob: result.dob,
        mobileNum: result.con_phone1,
        homeNum: result.con_phone2,
        workNum: result.con_phone3,
        email: result.email_address
      };
    });
  };

  return {
    execute: async id => {
      try {
        const tenants = await fetchTenants(id);
        return processTenants(tenants);
      } catch (err) {
        logger.error(`Error fetching tenants in UHT-Tenancies/FetchTenants: ${err}`, err);
      }
      return [];
    }
  };
};
