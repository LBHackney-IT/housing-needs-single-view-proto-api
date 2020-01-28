const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');

const { fetchCTCustomerDocumentsSQL, fetchHBCustomerDocumentsSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

const fetchCTCustomerDocuments = async (id, db) => {
  return await db.request(fetchCTCustomerDocumentsSQL, [
    { id: 'account_ref', type: 'NVarChar', value: id }
  ]);
};

const fetchHBCustomerDocuments = async (id, db) => {
  return await db.request(fetchHBCustomerDocumentsSQL, [
    { id: 'claim_id', type: 'NVarChar', value: id }
  ]);
};

const processDocumentsResults = function(results) {
  return results.map(doc => {
    return {
      id: doc.DocNo,
      title: 'Document',
      text: doc.DocDesc + `${doc.title ? ' - ' + doc.title : ''}`,
      date: formatRecordDate(doc.DocDate),
      user: doc.UserID,
      system: Systems.COMINO
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async query => {
    let results;
    try {
      if (query.claim_id) {
        results = await fetchHBCustomerDocuments(query.claim_id, db);
      } else if (query.account_ref) {
        results = await fetchCTCustomerDocuments(query.account_ref, db);
      }
      return processDocumentsResults(results);
    } catch (err) {
      console.log(`Error fetching customer documents in Comino: ${err}`);
    }
  };
};
