const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const {
  Sentry,
  customerSearch,
  fetchDocuments,
  fetchNotes,
  fetchRecords,
  saveCustomer,
  deleteCustomer,
  createSharedPlan,
  findSharedPlans,
  createVulnerabilitySnapshot,
  findVulnerabilitySnapshots,
  fetchTenancy,
  fetchAreaPatch,
  fetchCautionaryAlerts,
  searchTenancies,
  fetchTransactions
} = require('./lib/libDependencies');

if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
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

app.post('/customers/:id/shared-plans', async (req, res, next) => {
  try {
    console.time('create-shared-plan');
    console.log('create shared plan', { params: req.params });

    const { id: planId } = await createSharedPlan({
      customerId: req.params.id,
      token: res.locals.hackneyToken
    });

    console.timeEnd('create-shared-plan');
    return res.send({ planId });
  } catch (err) {
    console.log('create shared plan failed', { error: err });
    next(err);
  }
});

app.get('/customers/:id/shared-plans', async (req, res, next) => {
  try {
    console.time('find-shared-plan');
    console.log('find shared plan', { params: req.params });

    const { planIds } = await findSharedPlans({
      customerId: req.params.id,
      token: res.locals.hackneyToken
    });

    console.timeEnd('find-shared-plan');
    return res.send({ planIds });
  } catch (err) {
    console.log('find shared plans failed', { error: err });
    next(err);
  }
});

app.post('/customers/:id/vulnerabilities', async (req, res, next) => {
  try {
    console.time('create-vulnerability-snapshot');
    console.log('create vulnerability snapshot', { params: req.params });

    const { snapshotId } = await createVulnerabilitySnapshot({
      customerId: req.params.id,
      token: res.locals.hackneyToken
    });

    console.timeEnd('create-vulnerability-snapshot');
    return res.send({ snapshotId });
  } catch (err) {
    console.log('create vulnerability snapshot failed', { error: err });
    next(err);
  }
});

app.get('/customers/:id/vulnerabilities', async (req, res, next) => {
  try {
    console.time('find-vulnerability-snapshots');
    console.log('find vulnerability snapshots', { params: req.params });

    const { snapshots } = await findVulnerabilitySnapshots({
      customerId: req.params.id,
      token: res.locals.hackneyToken
    });

    console.timeEnd('find-vulnerability-snapshots');
    return res.send({ snapshots });
  } catch (err) {
    console.log('find vulnerability snapshots', { error: err });
    next(err);
  }
});

app.get('/tenancies/:id', async (req, res, next) => {
  const tenancyId = req.params.id.replace('-', '/');
  try {
    console.time('get-tenancy');
    console.log('get-tenancy', { params: req.params });

    const tenancy = await fetchTenancy(tenancyId, res.locals.hackneyToken);
    const areaPatch = await fetchAreaPatch(tenancy.uprn);

    tenancy.areaPatch = areaPatch;

    const mergedContacts = tenancy.contacts.map(async contact => {
      const alerts = await fetchCautionaryAlerts(
        tenancyId.split('/')[0],
        contact.personNo
      );
      return { ...contact, alerts: alerts.contacts[0].alerts };
    });
    const resolvedContacts = await Promise.all(mergedContacts);

    tenancy.contacts = resolvedContacts;

    console.timeEnd('get-tenancy');

    return res.send({ tenancy });
  } catch (err) {
    console.log('get-tenancy', { error: err });
    next(err);
  }
});

app.get('/tenancies/:id/transactions', async (req, res, next) => {
  const tenancyId = req.params.id.replace('-', '/');
  try {
    console.time('get-transactions');
    console.log('get-transactions', { params: req.params });

    const transactions = await fetchTransactions(tenancyId);

    console.timeEnd('get-transactions');

    return res.send({ transactions });
  } catch (err) {
    console.log('get-transactions', { error: err });
    next(err);
  }
});

app.get('/tenancies', async (req, res, next) => {
  try {
    console.log('search-tenancies', { query: req.query });
    console.time('search-tenancies', { query: req.query });

    const tenancies = await searchTenancies(req.query);

    console.timeEnd('search-tenancies');

    return res.send({ tenancies });
  } catch (err) {
    console.log('search-tenancies', { error: err });
    next(err);
  }
});

if (Sentry) {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(err) {
        return true;
      }
    })
  );
}

app.use(function(err, req, res, next) {
  console.log(err);
  res.sendStatus(500);
});

module.exports = {
  handler: serverless(app)
};
