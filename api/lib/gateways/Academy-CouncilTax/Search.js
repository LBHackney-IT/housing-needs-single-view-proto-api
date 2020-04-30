const path = require('path');
const { dedupe, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { searchCustomersSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildSearchRecord = options.buildSearchRecord;
  const Logger = options.Logger;

  const validateIds = record => {
    return record.account_ref && record.account_cd;
  };

  const processRecords = records => {
    return dedupe(records, item => item.account_ref)
      .filter(record => validateIds(record))
      .map(record => {
        return buildSearchRecord({
          id: `${record.account_ref}${record.account_cd}`,
          firstName: record.lead_liab_forename,
          lastName: record.lead_liab_surname,
          dob: record.birth_date,
          nino: record.nino,
          address: [
            record.addr1,
            record.addr2,
            record.addr3,
            record.addr4,
            record.postcode
          ],
          postcode: record.postcode,
          links: {
            hbClaimId: record.hb_claim_id
          },
          source: Systems.ACADEMY_COUNCIL_TAX
        });
      });
  };
  const search = async queryParams => {
    let fullName = [queryParams.lastName, queryParams.firstName]
      .filter(i => i && i !== '')
      .map(i => i.toUpperCase().trim())
      .join('%');

    return await db.request(searchCustomersSQL, [
      { id: 'full_name', type: 'NVarChar', value: fullName }
    ]);
  };

  return {
    execute: async queryParams => {
      try {
        const records = await search(queryParams);
        return processRecords(records);
      } catch (err) {
        Logger.error(
          `Error searching customers in Academy-CouncilTax: ${err}`,
          err
        );
        return [];
      }
    }
  };
};
