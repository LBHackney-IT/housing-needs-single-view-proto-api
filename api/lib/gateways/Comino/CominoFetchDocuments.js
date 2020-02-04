const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');

const { fetchCTCustomerDocumentsSQL, fetchHBCustomerDocumentsSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

module.exports = options => {
  db = options.db;
  buildDocument = options.buildDocument;

  const fetchHBCustomerDocuments = async (id, db) => {
    return await db.request(fetchHBCustomerDocumentsSQL, [
      { id: 'claim_id', type: 'NVarChar', value: id }
    ]);
  };

  const fetchCTCustomerDocuments = async (id, db) => {
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
      let documents;
      try {
        if (queryParams.claim_id) {
          documents = await fetchHBCustomerDocuments(queryParams.claim_id, db);
        } else if (queryParams.account_ref) {
          documents = await fetchCTCustomerDocuments(
            queryParams.account_ref,
            db
          );
        }
        return processDocuments(documents);
      } catch (err) {
        console.log('tis error');
      }
    }
  };
};
