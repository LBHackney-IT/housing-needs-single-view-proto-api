const mimeTypes = require('mime-types');
const { MimeType } = require('../Constants');

module.exports = options => {
  const jigsawDocGateway = options.jigsawDocGateway;
  const jigsawMetadataGateway = options.jigsawMetadataGateway;

  return async (jigsawId, documentId) => {
    const metadata = await jigsawMetadataGateway.execute(jigsawId);
    const doc = await jigsawDocGateway.execute(documentId);

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
