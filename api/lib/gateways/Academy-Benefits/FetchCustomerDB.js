const path = require('path');
const { Systems } = require('../../Constants');
const {
  checkString,
  nameCase,
  formatAddress,
  formatRecordDate,
  upperCase,
  loadSQL
} = require('../../Utils');
const { fetchCustomerSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;

  const processRecord = record => {
    return {
      systemIds: {
        academyBenefits: [`${record.claim_id}${record.check_digit}`]
      },
      name: [
        {
          first: nameCase(record.forename),
          last: nameCase(record.surname),
          title: nameCase(record.title)
        }
      ],
      dob: [formatRecordDate(record.birth_date)],
      address: [
        {
          source: Systems.ACADEMY_BENEFITS,
          address: formatAddress([
            record.addr1,
            record.addr2,
            record.addr3,
            record.addr4,
            record.post_code
          ])
        }
      ],
      nino: [upperCase(record.nino)],
      postcode: [checkString(record.post_code)],
      benefits: {
        live: record.status_ind == 1
      }
    };
  };

  return {
    execute: async (claimId, personRef) => {
      const record = await db.request(fetchCustomerSQL, [
        { id: 'claim_id', type: 'NVarChar', value: claimId.slice(0, 7) },
        { id: 'person_ref', type: 'Int', value: personRef }
      ]);

      return processRecord(record[0]);
    }
  };
};
