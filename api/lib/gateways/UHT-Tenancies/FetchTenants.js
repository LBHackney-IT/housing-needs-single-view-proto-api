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
        firstName: checkString(result.forename),
        lastName: checkString(result.surname),
        dateOfBirth: result.dob,
        telephone1: checkString(result.con_phone1),
        telephone2: checkString(result.con_phone2),
        telephone3: checkString(result.con_phone3),
        emailAddress: checkString(result.email_address),
        personNo: result.person_no,
        responsible: !!result.responsible,
        relationship: result.relationship
      };
    });
  };

  return {
    execute: async id => {
      try {
        const tenants = await fetchTenants(id);
        return processTenants(tenants);
      } catch (err) {
        logger.error(
          `Error fetching tenants in UHT-Tenancies/FetchTenants: ${err}`,
          err
        );
      }
      return [];
    }
  };
};
