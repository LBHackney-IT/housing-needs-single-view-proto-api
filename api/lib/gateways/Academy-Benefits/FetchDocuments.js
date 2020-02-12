const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerDocumentsSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildDocument = options.buildDocument;
  const cominoFetchDocumentsGateway = options.cominoFetchDocumentsGateway;
  const getSystemId = options.getSystemId;

  const fetchSystemIds = async id => {
    const systemId = await getSystemId.execute(Systems.ACADEMY_BENEFITS, id);
    if (systemId.length) return systemId.map(id => id.split('/')[0]);
  };

  const fetchCustomerDocuments = async claim_id => {
    return await db.request(fetchCustomerDocumentsSQL, [
      { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) }
    ]);
  };

  const processDocuments = records => {
    return records.map(doc => {
      return buildDocument({
        id: doc.document_id,
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
        const claim_ids = await fetchSystemIds(id);
        const documents = [];
        if (claim_ids) {
          for (const id of claim_ids) {
            const academyRecords = await fetchCustomerDocuments(id);
            const cominoResults = await cominoFetchDocumentsGateway.execute({
              claim_id: id
            });
            documents.push(processDocuments(academyRecords).concat(cominoResults));
          }
        }
        return documents;
      } catch (err) {
        console.log(
          `Error fetching customer documents in Academy-Benefits: ${err}`
        );
      }
      return [];
    }
  };
};
