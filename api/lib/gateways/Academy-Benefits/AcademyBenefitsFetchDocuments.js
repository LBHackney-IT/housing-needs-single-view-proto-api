const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerDocumentsSQL } = loadSQL(path.join(__dirname, 'sql'));
//const Comino = require('../../backends/Comino');

module.exports = options => {
  const db = options.db;
  const buildDocument = options.buildDocument;
  const Comino = options.Comino;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    const systemId = await getSystemId(Systems.ACADEMY_BENEFITS, id);
    if (systemId) return systemId.split('/')[0];
  };

  async function fetchCustomerDocuments(claim_id, db) {
    return await db.request(fetchCustomerDocumentsSQL, [
      { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) }
    ]);
  }

  const processRecords = records => {
    return records.map(doc => {
      return buildDocument({
        title: 'Academy Document',
        text: doc.correspondence_code,
        date: doc.completed_date,
        user: doc.user_id,
        system: Systems.ACADEMY_BENEFITS
      });
    });
  };

  return {
    execute: async id => {
      try {
        const claim_id = await fetchSystemId(id);
        if (claim_id) {
          const academyRecords = await fetchCustomerDocuments(claim_id, db);
          const cominoResults = await Comino.execute({ claim_id });
          return processRecords(academyRecords).concat(cominoResults);
        }
        return [];
      } catch (err) {
        console.log(
          `Error fetching customer documents in Academy-Benefits: ${err}`
        );
        return [];
      }
    }
  };
};
