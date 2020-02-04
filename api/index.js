require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const QueryHandler = require('./lib/QueryHandler');
const { customerSearch } = require('./lib/libDependencies');

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

app.get('/customers/:id', async (req, res) => {
  console.log(`GET CUSTOMER LINKS id="${req.params.id}"`);
  console.time(`GET CUSTOMER LINKS id="${req.params.id}"`);
  const result = await QueryHandler.fetchCustomer(req.params.id);
  console.timeEnd(`GET CUSTOMER LINKS id="${req.params.id}"`);
  res.send({ customer: result });
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
  const result = await QueryHandler.fetchCustomerRecord(req.params.id);
  console.timeEnd(`GET CUSTOMER id="${req.params.id}"`);
  res.send({ customer: result });
});

app.get('/customers/:id/notes', async (req, res) => {
  console.log(`GET CUSTOMER NOTES id="${req.params.id}"`);
  console.time(`GET CUSTOMER NOTES id="${req.params.id}"`);
  const results = await QueryHandler.fetchCustomerNotes(
    req.params.id,
    res.locals.hackneyToken
  );
  console.timeEnd(`GET CUSTOMER NOTES id="${req.params.id}"`);
  res.send(results);
});

app.get('/customers/:id/documents', async (req, res) => {
  const {
    doJigsawGetRequest,
    doJigsawPostRequest,
    jigsawEnv
  } = require('./lib/JigsawUtils');
  const SqlServerConnection = require('./lib/SqlServerConnection');
  const buildDocument = require('./lib/entities/Document')();
  const postgresDb = require('./lib/PostgresDb');
  const getSystemId = require('./lib/gateways/SingleView/SystemID')({
    db: postgresDb
  });
  const cominoFetchDocumentsGateway = require('./lib/gateways/Comino/CominoFetchDocuments')(
    {
      buildDocument,
      db: new SqlServerConnection({
        dbUrl: process.env.HN_COMINO_URL
      })
    }
  );
  const academyBenefitsFetchDocumentsGateway = require('./lib/gateways/Academy-Benefits/AcademyBenefitsFetchDocuments')(
    {
      db: new SqlServerConnection({
        dbUrl: process.env.ACADEMY_DB
      }),
      buildDocument,
      cominoFetchDocumentsGateway,
      getSystemId
    }
  );
  const jigsawFetchDocumentsGateway = require('./lib/gateways/Jigsaw/JigsawFetchDocuments')(
    {
      buildDocument,
      doJigsawGetRequest,
      doJigsawPostRequest,
      getSystemId,
      jigsawEnv
    }
  );

  const academyCouncilTaxFetchDocumentsGateway = require('./lib/gateways/Academy-CouncilTax/AcademyCouncilTaxFetchDocuments')(
    {
      cominoFetchDocumentsGateway,
      getSystemId
    }
  );

  const fetchDocuments = require('./lib/use-cases/FetchDocuments')({
    gateways: [
      academyCouncilTaxFetchDocumentsGateway,
      academyBenefitsFetchDocumentsGateway,
      jigsawFetchDocumentsGateway
    ]
  });
  console.log(`GET CUSTOMER DOCS id="${req.params.id}"`);
  console.time(`GET CUSTOMER DOCS id="${req.params.id}"`);
  const results = await fetchDocuments(req.params.id);
  console.timeEnd(`GET CUSTOMER DOCS id="${req.params.id}"`);
  res.send(results);
});

module.exports.handler = serverless(app);
