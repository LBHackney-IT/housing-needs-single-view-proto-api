require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const QueryHandler = require('./lib/QueryHandler');
const {
  addVulnerability,
  customerSearch,
  fetchDocuments,
  fetchNotes,
  fetchRecords,
  getJigsawDocument
} = require('./lib/libDependencies');

if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
  const Sentry = require('@sentry/node');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV
  });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
}

app.use(bodyParser.json());

if (process.env.ENABLE_CACHING === 'true') {
  console.log('Enabling Cache');
  const ExpressCache = require('express-cache-middleware');
  const cacheManager = require('cache-manager');

  const cacheMiddleware = new ExpressCache(
    cacheManager.caching({
      store: 'memory',
      max: 10000,
      ttl: 3600
    }),
    {
      hydrate: (req, res, data, cb) => {
        res.contentType('application/json');
        cb(null, data);
      }
    }
  );
  cacheMiddleware.attach(app);
}

app.use(function(req, res, next) {
  if (req.headers.authorization) {
    res.locals.hackneyToken = req.headers.authorization.replace('Bearer ', '');
  }
  next();
});

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/customers', async (req, res) => {
  const q = Object.entries(req.query)
    .map(([k, v]) => {
      return `${k}:${v}`;
    })
    .join(',');
  console.log(`CUSTOMER SEARCH "${q}"`);
  console.time(`CUSTOMER SEARCH "${q}"`);

  try {
    const results = await customerSearch(req.query);
    res.send(results);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
  console.timeEnd(`CUSTOMER SEARCH "${q}"`);
});

app.post('/customers', async (req, res) => {
  console.log('SAVING CUSTOMER');
  console.time('SAVING CUSTOMER');
  // Save the selected customer records
  const customer = await QueryHandler.saveCustomer(req.body.customers);
  console.timeEnd('SAVING CUSTOMER');
  res.send({ customer });
});

app.delete('/customers/:id', async (req, res) => {
  console.log(`DELETE CUSTOMER id="${req.params.id}"`);
  console.time(`DELETE CUSTOMER id="${req.params.id}"`);
  await QueryHandler.deleteCustomer(req.params.id);
  console.timeEnd(`DELETE CUSTOMER id="${req.params.id}"`);
  res.sendStatus(200);
});

app.get('/customers/:id/record', async (req, res) => {
  console.log(`GET CUSTOMER id="${req.params.id}"`);
  console.time(`GET CUSTOMER id="${req.params.id}"`);
  const result = await fetchRecords(req.params.id);
  console.timeEnd(`GET CUSTOMER id="${req.params.id}"`);
  res.send({ customer: result });
});

app.get('/customers/:id/notes', async (req, res) => {
  console.log(`GET CUSTOMER NOTES id="${req.params.id}"`);
  console.time(`GET CUSTOMER NOTES id="${req.params.id}"`);
  const results = await fetchNotes(req.params.id, res.locals.hackneyToken);
  console.timeEnd(`GET CUSTOMER NOTES id="${req.params.id}"`);
  res.send(results);
});

app.get('/customers/:id/documents', async (req, res) => {
  console.log(`GET CUSTOMER DOCS id="${req.params.id}"`);
  console.time(`GET CUSTOMER DOCS id="${req.params.id}"`);
  const results = await fetchDocuments(req.params.id);
  console.timeEnd(`GET CUSTOMER DOCS id="${req.params.id}"`);
  res.send(results);
});

app.post('/customers/:id/vulnerabilities', async (req, res) => {
  console.log('SAVING VULNERABILITY');
  console.time('SAVING VULNERABILITY');
  // Save the selected vulnerability
  let vulnerability = req.body;
  vulnerability.customerId = req.params.id;
  const id = await addVulnerability(vulnerability);
  console.timeEnd('SAVING VULNERABILITY');
  res.send({ id });
});
const getJigsawDocDownloadTemplate = () => {};
const getJigsawDoc = async event => {
  const { doc, mimeType, filename } = await getJigsawDocument(
    event.pathParameters.jigsawDocId,
    event.pathParameters.customerId
  );
  return {
    statusCode: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Length': doc.length,
      'Content-Disposition': `inline; filename="${filename}"`
    },
    body: doc.toString('base64'),
    isBase64Encoded: true
  };
};

module.exports = {
  handler: serverless(app),
  getJigsawDoc,
  app
};
