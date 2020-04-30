const { Systems } = require('../../Constants');
const { formatRecordDate } = require('../../Utils');

module.exports = options => {
  const fetchDocMetadataGateway = options.fetchDocMetadataGateway;
  const buildDocument = options.buildDocument;
  const Logger = options.Logger;

  const processDocuments = (documents, userid) => {
    return documents.map(doc => {
      return buildDocument({
        userid,
        id: doc.id,
        title: 'Document',
        text: doc.name,
        date: formatRecordDate(doc.date),
        user: doc.casePersonName,
        system: Systems.JIGSAW,
        format: doc.format
      });
    });
  };

  return {
    execute: async id => {
      try {
        if (id) {
          const documents = await fetchDocMetadataGateway.execute(id);
          return processDocuments(documents, id);
        }
        return [];
      } catch (err) {
        Logger.error(
          `Error fetching customer documents in Jigsaw: ${err}`,
          err
        );
        return [];
      }
    }
  };
};
