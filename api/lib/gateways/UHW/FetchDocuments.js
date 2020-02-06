const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerDocumentsSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildDocument = options.buildDocument;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    const systemId = await getSystemId.execute(Systems.UHW, id);
    if (systemId) return systemId;
  };

  const fetchCustomerDocumentsQuery = async id => {
    return await db.request(fetchCustomerDocumentsSQL, [
      { id: 'id', type: 'Int', value: id }
    ]);
  };

  const processDocuments = results => {
    return results.map(doc => {
      return buildDocument({
        id: doc.DocNo,
        title: 'Document',
        text: `${doc.DocDesc}${doc.title ? ' - ' + doc.title : ''}`,
        date: doc.DocDate,
        user: doc.UserID,
        system: Systems.UHW
      });
    });
  };

  return {
    execute: async id => {
      try {
        const uhw_id = await fetchSystemId(id);
        if (uhw_id) {
          const results = await fetchCustomerDocumentsQuery(uhw_id);
          return processDocuments(results);
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer documents in UHW: ${err}`);
        return [];
      }
    }
  };
};
