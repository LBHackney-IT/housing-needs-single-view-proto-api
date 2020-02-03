const path = require('path');
const { formatRecordDate, loadSQL } = require('@lib/Utils');
const Comino = require('@lib/backends/Comino');
const { Systems } = require('@lib/Constants');
const { fetchCustomerDocumentsSQL } = loadSQL(path.join(__dirname, 'sql'));

async function fetchCustomerDocuments(id, db) {
  const claim_id = id.split('/')[0];

  return await db.request(fetchCustomerDocumentsSQL, [
    { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) }
  ]);
}

let processDocumentsResults = function(results) {
  return results.map(doc => {
    return {
      title: 'Academy Document',
      text: doc.correspondence_code,
      date: formatRecordDate(doc.completed_date),
      user: doc.user_id,
      system: Systems.ACADEMY_BENEFITS
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const claim_id = id.split('/')[0];
      const academyResults = await fetchCustomerDocuments(id, db);
      const cominoResults = await Comino.fetchCustomerDocuments({ claim_id });
      return processDocumentsResults(academyResults).concat(cominoResults);
    } catch (err) {
      console.log(
        `Error fetching customer documents in Academy-Benefits: ${err}`
      );
    }
  };
};
