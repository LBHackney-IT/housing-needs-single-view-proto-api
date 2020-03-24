const mimeTypes = require('mime-types');
const { MimeType } = require('../Constants');

module.exports = options => {
  const jigsawDocGateway = options.jigsawDocGateway;
  const jigsawMetadataGateway = options.jigsawMetadataGateway;

  return async (id, userId) => {
    const doc = await jigsawDocGateway.execute(id);
    const metadata = await jigsawMetadataGateway.execute(userId);

    let fileExt = MimeType.Default;
    let filename = 'download';
    const intId = parseInt(id, 10);
    metadata.forEach(m => {
      if (m.id === intId) {
        fileExt = m.format;
        filename = m.text;
      }
    });

    const mimeType = mimeTypes.lookup(fileExt) || MimeType.Default;
    return { doc, mimeType, filename };
  };
};
