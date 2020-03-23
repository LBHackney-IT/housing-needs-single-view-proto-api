const mimeTypes = require('mime-types');
const { MimeType } = require('../Constants');

module.exports = options => {
  const jigsawDocGateway = options.jigsawDocGateway;
  const jigsawMetadataGateway = options.jigsawMetadataGateway;

  return async (id, userId) => {
    const doc = await jigsawDocGateway.execute(id);
    const metadata = await jigsawMetadataGateway.execute(userId);
    console.log('-----------');
    console.log(metadata);
    console.log('-----------');

    let i = 0;
    let fileExt = MimeType.Default;
    do {
      if (metadata[i].id === id) {
        fileExt = metadata[i].format;
      }
      i = i + 1;
    } while (metadata[i].id !== id);

    const mimeType = mimeTypes.lookup(fileExt) || MimeType.Default;
    return { doc, mimeType };
  };
};
