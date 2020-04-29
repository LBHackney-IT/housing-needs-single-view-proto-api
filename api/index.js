const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const {
  customerSearch,
  fetchDocuments,
  fetchNotes,
  fetchRecords,
  saveCustomer,
  deleteCustomer
} = require('./lib/libDependencies');

let Sentry;
if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
  Sentry = require('@sentry/node');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV
  });

  app.use(Sentry.Handlers.requestHandler());
}

app.use(bodyParser.json());

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

app.get('/customers', async (req, res, next) => {
  try {
    const q = querystring.stringify(req.query);
    console.log(`CUSTOMER SEARCH "${q}"`);
    console.time(`CUSTOMER SEARCH "${q}"`);
    const results = await customerSearch(req.query);
    console.timeEnd(`CUSTOMER SEARCH "${q}"`);
    res.send(results);
  } catch (err) {
    next(err);
  }
});

app.post('/customers', async (req, res, next) => {
  try {
    console.log('SAVING CUSTOMER');
    console.time('SAVING CUSTOMER');
    // Save the selected customer records
    const customer = await saveCustomer(req.body.customers);
    console.timeEnd('SAVING CUSTOMER');
    res.send({ customer });
  } catch (err) {
    next(err);
  }
});

app.delete('/customers/:id', async (req, res, next) => {
  try {
    console.log(`DELETE CUSTOMER id="${req.params.id}"`);
    console.time(`DELETE CUSTOMER id="${req.params.id}"`);
    await deleteCustomer(req.params.id);
    console.timeEnd(`DELETE CUSTOMER id="${req.params.id}"`);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

app.get('/customers/:id/record', async (req, res, next) => {
  try {
    console.log(`GET CUSTOMER id="${req.params.id}"`);
    console.time(`GET CUSTOMER id="${req.params.id}"`);
    const result = await fetchRecords(req.params.id);
    console.timeEnd(`GET CUSTOMER id="${req.params.id}"`);
    res.send({ customer: result });
  } catch (err) {
    next(err);
  }
});

app.get('/customers/:id/notes', async (req, res, next) => {
  try {
    console.log(`GET CUSTOMER NOTES id="${req.params.id}"`);
    console.time(`GET CUSTOMER NOTES id="${req.params.id}"`);
    const results = await fetchNotes(req.params.id, res.locals.hackneyToken);
    console.timeEnd(`GET CUSTOMER NOTES id="${req.params.id}"`);
    res.send(results);
  } catch (err) {
    next(err);
  }
});

app.get('/customers/:id/documents', async (req, res, next) => {
  try {
    console.log(`GET CUSTOMER DOCS id="${req.params.id}"`);
    console.time(`GET CUSTOMER DOCS id="${req.params.id}"`);
    const results = await fetchDocuments(
      req.params.id,
      res.locals.hackneyToken
    );
    console.timeEnd(`GET CUSTOMER DOCS id="${req.params.id}"`);
    res.send(results);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  handler: serverless(app)
};
