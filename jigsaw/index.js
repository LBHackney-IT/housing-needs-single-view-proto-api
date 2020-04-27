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

docCanBeDisplayed = (queryStringParameters, mimeType) => {
  return (
    (queryStringParameters && queryStringParameters.download) ||
    mimeType === 'application/pdf' ||
    mimeType === 'image/jpeg' ||
    mimeType === 'image/png' ||
    mimeType === 'text/plain' ||
    mimeType === 'application/xml'
  );
};

buildResponse = (body, mimeType, encoded) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: body,
    isBase64Encoded: encoded
  };
};

module.exports.handler = async event => {
  try {
    const { doc, mimeType } = await getJigsawDocument(
      event.pathParameters.jigsawId,
      event.pathParameters.documentId
    );
    if (docCanBeDisplayed(event.queryStringParameters, mimeType)) {
      return buildResponse(doc.toString('base64'), mimeType, true);
    } else {
      const body = `<html><body><p>This document is not able to display in your browser. <a href='${event.path}?download=true'>Download it here</a></p></body></html>`;
      return buildResponse(body, 'text/html', false);
    }
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    await Sentry.flush();
  }
};
