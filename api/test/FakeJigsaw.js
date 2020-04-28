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
  } else if (req.query.search === 'elwira moncur') {
    res.send([
      {
        address: 'address',
        doB: '1971-12-22T00:00:00',
        email: null,
        firstName: 'elwira',
        homePhone: null,
        householdMembers: 'Somenone some, One someone',
        id: 123,
        lastName: 'MONCUR',
        mobilePhone: '07000000000',
        nhsNumber: null,
        nickName: null,
        niNumber: 'CD877332Z'
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

app.get('/homelessness/api/casecheck/:id', (req, res) => {
  if (req.params.id === '12345')
    res.send({
      cases: [
        {
          assignedTo: 'Person',
          dateOfApproach: '2018-07-05T01:00:00',
          id: 54321,
          isCurrent: true,
          isV2LegacyCase: true,
          statusName: 'Open'
        }
      ]
    });
  else res.send({ customer: false });
});

app.get('/customer/api/CustomerOverview/:id', (req, res) => {
  if (req.params.id === '12345') {
    res.send({
      personInfo: {
        addressString: 'Hackney London W3 43NO',
        dateOfBirth: '1991-02-13T00:00:00',
        emailAddress: 'james@hotmail.com',
        homePhoneNumber: null,
        mobilePhoneNumber: '07666666666',
        nhsNumber: '',
        nationalInsuranceNumber: 'ABC12345D',
        supportWorker: null
      }
    });
  } else res.send({ customer: false });
});

app.get('/accommodation/api/CaseAccommodationPlacement', (req, res) => {
  if (req.query.caseId === '54321') {
    res.send({
      placements: [
        {
          address: 'Room 1 hallway drive ',
          endDate: null,
          placementDuty: 'Section 192',
          placementType: 'Accommodation secured by the Local Authority',
          startDate: '2019-04-05T00:00:00',
          tenancyId: 64444,
          rentCostCustomer: 0
        }
      ],
      isCurrentlyInPlacement: true
    });
  } else res.send({ customer: false });
});

app.get('/api/Customer/:id/Notes', (req, res) => {
  if (req.params.id === '12345') {
    res.send({
      placements: [
        {
          address: 'Room 1 hallway drive ',
          endDate: null,
          placementDuty: 'Section 192',
          placementType: 'Accommodation secured by the Local Authority',
          startDate: '2019-04-05T00:00:00',
          tenancyId: 64444,
          rentCostCustomer: 0
        }
      ],
      isCurrentlyInPlacement: true
    });
  } else res.send({ customer: false });
});

app.listen(port, () =>
  console.log(`Fake Jigsaw API listening on port ${port}!`)
);
