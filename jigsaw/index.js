const {
  doJigsawGetRequest,
  doJigsawPostRequest,
  doGetDocRequest,
  login
} = require('../api/lib/JigsawUtils');

const buildDocument = require('../api/lib/entities/Document')();

const jigsawFetchDocumentsGateway = require('../api/lib/gateways/Jigsaw/FetchDocuments')(
  {
    buildDocument,
    doJigsawGetRequest,
    doJigsawPostRequest
  }
);

const fetchDocumentImage = require('../api/lib/gateways/Jigsaw/FetchDocumentImage')(
  {
    doGetDocRequest,
    login
  }
);

const getJigsawDocument = require('../api/lib/use-cases/GetJigsawDocument')({
  jigsawDocGateway: fetchDocumentImage,
  jigsawMetadataGateway: jigsawFetchDocumentsGateway
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
