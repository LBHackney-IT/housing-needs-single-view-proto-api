const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerDocumentsSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const { buildDocument, db, fetchW2Documents, Logger } = options;
  const fetchSystemId = async id => {
    if (id) return id.split('/')[0];
  };

  const fetchCustomerDocuments = async claim_id => {
    return await db.request(fetchCustomerDocumentsSQL, [
      { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) }
    ]);
  };

  const processDocuments = records => {
    return records.map(doc => {
      return buildDocument({
        userid: null,
        id: doc.document_id,
        title: 'Academy Document',
        text: doc.correspondence_code,
        date: doc.completed_date,
        user: doc.user_id,
        system: Systems.ACADEMY_BENEFITS,
        format: null
      });
    });
  };

  return {
    execute: async (id, token) => {
      try {
        const claim_id = await fetchSystemId(id);
        if (!claim_id) return [];

        const academyRecords = await fetchCustomerDocuments(claim_id);
        const cominoRecords = await fetchW2Documents(
          { id: claim_id, gateway: 'hncomino' },
          token
        );

        const documents = processDocuments(academyRecords).concat(
          cominoRecords.map(doc => buildDocument(doc))
        );

        return documents;
      } catch (err) {
        Logger.error(
          `Error fetching customer documents in Academy-Benefits: ${err}`,
          err
        );
        return [];
      }
    }
  };
};
