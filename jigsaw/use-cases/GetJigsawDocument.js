const mimeTypes = require('mime-types');
const { MimeType } = require('../../api/lib/Constants');

module.exports = options => {
  const fetchDocMetadataGateway = options.fetchDocMetadataGateway;
  const fetchDocImageGateway = options.fetchDocImageGateway;

  return async (jigsawCaseId, documentId) => {
    const metadata = await fetchDocMetadataGateway.execute(jigsawCaseId);
    const doc = await fetchDocImageGateway.execute(documentId);

    let fileExt = MimeType.Default;
    let filename = 'download';
    const intId = parseInt(documentId, 10);
    metadata.forEach(m => {
      if (m.id === intId) {
        fileExt = m.format;
        if (m.text) filename = m.text;
      }
    });

    const mimeType = mimeTypes.lookup(fileExt) || MimeType.Default;
    return { doc, mimeType, filename };
  };
};
