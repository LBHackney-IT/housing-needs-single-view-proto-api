const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerDocumentsSQL } = loadSQL(path.join(__dirname, 'sql'));

const fetchCustomerDocumentsQuery = async (id, db) => {
  return await db.request(fetchCustomerDocumentsSQL, [
    { id: 'id', type: 'Int', value: id }
  ]);
};

const processDocumentsResults = results => {
  return results.map(doc => {
    return {
      id: doc.DocNo,
      title: 'Document',
      text: doc.DocDesc + `${doc.title ? ' - ' + doc.title : ''}`,
      date: formatRecordDate(doc.DocDate),
      user: doc.UserID,
      system: Systems.UHW
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const results = await fetchCustomerDocumentsQuery(id, db);
      return processDocumentsResults(results);
    } catch (err) {
      console.log(`Error fetching customer documents in UHW: ${err}`);
    }
  };
};
