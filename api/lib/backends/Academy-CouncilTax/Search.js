const path = require('path');
const {
  checkString,
  nameCase,
  formatAddress,
  formatDisplayDate,
  upperCase,
  dedupe,
  loadSQL
} = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersSQL } = loadSQL(path.join(__dirname, 'sql'));

const runSearchQuery = async (queryParams, db) => {
  let fullName = [queryParams.lastName, queryParams.firstName]
    .filter(i => i && i !== '')
    .map(i => i.toUpperCase())
    .join('%');

  return await db.request(searchCustomersSQL, [
    { id: 'full_name', type: 'NVarChar', value: fullName }
  ]);
};

const processSearchResults = function(results) {
  return dedupe(results, item => item.account_ref).map(record => {
    return {
      id: `${record.account_ref}${record.account_cd}`,
      firstName: nameCase(record.lead_liab_forename),
      lastName: nameCase(record.lead_liab_surname),
      dob: record.birth_date ? formatDisplayDate(record.birth_date) : null,
      nino: upperCase(record.nino),
      address: formatAddress([
        record.addr1,
        record.addr2,
        record.addr3,
        record.addr4,
        record.post_code
      ]).join(', '),
      postcode: checkString(record.postcode),
      links: {
        hbClaimId: record.hb_claim_id
      },
      source: Systems.ACADEMY_COUNCIL_TAX
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async query => {
    try {
      const results = await runSearchQuery(query, db);
      return processSearchResults(results);
    } catch (err) {
      console.log(`Error searching customers in Academy-CouncilTax: ${err}`);
      return [];
    }
  };
};
