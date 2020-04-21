const {
  doJigsawGetRequest,
  doJigsawPostRequest
} = require('../api/lib/JigsawUtils');

const getJigsawDocument = require('./use-cases/GetJigsawDocument')({
  fetchDocImageGateway: require('./gateways/FetchDocumentImage')({
    doJigsawGetRequest
  }),
  fetchDocMetadataGateway: require('./gateways/FetchDocumentMetadata')({
    doJigsawGetRequest,
    doJigsawPostRequest
  })
});

module.exports.handler = async event => {
  const { doc, mimeType } = await getJigsawDocument(
    event.pathParameters.jigsawId,
    event.pathParameters.documentId
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: doc.toString('base64'),
    isBase64Encoded: true
  };
};
