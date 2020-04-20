const express = require('express');
const app = express();
//const cors = require('cors');
const port = 8080;

//app.use(cors());

app.get('/customers', (req, res) => {
  res.send({ cookies: 'yes' });
});

app.get('/auth/login', (req, res) => {
  res.setHeader('set-cookie', ['one;two']);
  const body =
    '<!DOCTYPE html> <html> <body> <input name=__RequestVerificationToken value=token></body></html>';
  res.send(body);
});

app.post('/auth/login', (req, res) => {
  res.setHeader('set-cookie', ['one;two']);
  res.setHeader('location', 'accesstoken=accesstoken');

  const body =
    '<!DOCTYPE html> <html> <body> <input name=__RequestVerificationToken value=token></body></html>';
  res.send(body);
});

app.get('/customer/api/customerSearch', (req, res) => {
  if (req.query.search === 'firstname lastname') {
    res.send([
      {
        address: '1 the streets',
        doB: '1974-11-06T00:00:00',
        email: null,
        firstName: 'firstName',
        homePhone: null,
        householdMembers: 'Somenone some, One someone',
        id: 123,
        lastName: 'LASTNAME',
        mobilePhone: '07000000000',
        nhsNumber: null,
        nickName: null,
        niNumber: 'SS111111A'
      }
    ]);
  } else {
    res.send([
      {
        id: 0
      }
    ]);
  }
});

app.listen(port, () =>
  console.log(`Fake Jigsaw API listening on port ${port}!`)
);
