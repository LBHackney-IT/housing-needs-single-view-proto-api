const mimeTypes = require('mime-types');
const { MimeType } = require('../Constants');

module.exports = options => {
  const jigsawDocGateway = options.jigsawDocGateway;
  const jigsawMetadataGateway = options.jigsawMetadataGateway;

  return async (id, userId) => {
    const doc = await jigsawDocGateway.execute(id);
    const metadata = await jigsawMetadataGateway.execute(userId);

    let fileExt = MimeType.Default;
    const intId = parseInt(id, 10);
    metadata.forEach(m => {
      if (m.id === intId) {
        fileExt = m.format;
      }
    });

    const mimeType = mimeTypes.lookup(fileExt) || MimeType.Default;
    return { doc, mimeType };
  };
};
