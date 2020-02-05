const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');

const { fetchCTCustomerDocumentsSQL, fetchHBCustomerDocumentsSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

module.exports = options => {
  const db = options.db;
  const buildDocument = options.buildDocument;

  const fetchHBCustomerDocuments = async id => {
    return await db.request(fetchHBCustomerDocumentsSQL, [
      { id: 'claim_id', type: 'NVarChar', value: id }
    ]);
  };

  const fetchCTCustomerDocuments = async id => {
    return await db.request(fetchCTCustomerDocumentsSQL, [
      { id: 'account_ref', type: 'NVarChar', value: id }
    ]);
  };

  const processDocuments = documents => {
    return documents.map(doc => {
      return buildDocument({
        id: doc.DocNo,
        title: 'Document',
        text: doc.DocDesc + `${doc.title ? ' - ' + doc.title : ''}`,
        date: doc.DocDate,
        user: doc.UserID,
        system: Systems.COMINO
      });
    });
  };

  return {
    execute: async queryParams => {
      try {
        if (queryParams.claim_id) {
          return processDocuments(
            await fetchHBCustomerDocuments(queryParams.claim_id)
          );
        } else if (queryParams.account_ref) {
          return processDocuments(
            await fetchCTCustomerDocuments(queryParams.account_ref)
          );
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer documents in Comino: ${err}`);
        return [];
      }
    }
  };
};
