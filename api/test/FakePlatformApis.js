const express = require('express');
const app = express();
const port = 8090;

app.get('/api/v1/claimants', (req, res) => {
  if (!req.headers['X-API-Key'] === 'super-secret-api-key') {
    res.sendStatus(403);
  } else {
    if (req.query.first_name === 'flor' && req.query.last_name === 'beden') {
      res.send({
        claimants:
          [{
            claimId: 6060591,
            checkDigit: '3',
            personRef: 2,
            firstName: 'Flor',
            lastName: 'Beden',
            dateOfBirth: '1981-02-08 00:00:00.0000000',
            niNumber: 'CD877342Z',
            claimantAddress: {
              addressLine1: '8017 Garrison Point',
              addressLine2: '2 Lake View Crossing',
              addressLine3: 'London',
              postcode: 'S3 1EV'
            }
          }],
        nextCursor: null
      });
    } else if (req.query.first_name === 'elwira' && req.query.last_name === 'moncur') {
      res.send({
        claimants:
          [{
            claimId: 5260765,
            checkDigit: '6',
            personRef: 1,
            firstName: 'Elwira',
            lastName: 'Moncur',
            dateOfBirth: '1971-12-22 00:00:00.0000000',
            niNumber: 'CD877332Z',
            claimantAddress: {
              addressLine1: '6 Cascade Junction',
              addressLine2: '49 Norway Maple Pass',
              addressLine3: 'London',
              postcode: 'I3 0RP'
            }
          }],
        nextCursor: null
      });
    } else if (req.query.first_name === 'tate' && req.query.last_name === 'Bullimore') {
      res.send({
        claimants:
          [{
            claimId: 5759744,
            checkDigit: '0',
            personRef: 1,
            firstName: 'Tate',
            lastName: 'Bullimore',
            dateOfBirth: '1971-09-25 00:00:00.0000000',
            niNumber: 'CD877534Z',
            claimantAddress: {
              addressLine1: '8 Schlimgen Terrace',
              addressLine2: '5111 Basil Avenue',
              addressLine3: 'London',
              postcode: 'E0 1MO'
            }
          }],
        nextCursor: null
      });
    } else {
      res.send({ claimants: []});
    }
  }
});

app.listen(port, () =>
  console.log(`Fake Academy API listening on port ${port}!`)
);
