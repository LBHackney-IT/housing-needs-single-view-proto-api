require('dotenv').config();
const Sentry = require('@sentry/node');
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

if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV
  });
}

module.exports.handler = async event => {
  try {
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
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    await Sentry.flush();
  }
};
