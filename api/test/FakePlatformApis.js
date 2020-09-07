const express = require('express');
const app = express();
const port = 8090;

app.get('/academy/api/v1/claimants', (req, res) => {
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

app.get('/tenancies/api/v1/tenancies', (req, res) => {
  if (!req.headers['Authorization'] === 'Bearer super-secret-api-token') {
    res.sendStatus(403);
  } else if (req.query.address === 'myaddressNumber1') {
    res.send({
      "tenancies": [
        {
          "tenancyAgreementReference":"000473/03",
          "address":"3 Hillman Street",
          "postcode":"E1 7HG",
          "commencementOfTenancyDate":"2010-04-15",
          "endOfTenancyDate": null,
          "currentBalance":"34",
          "present":true,
          "terminated":false,
          "paymentReference":"57757375849379",
          "householdReference":"8265926",
          "propertyReference":"734638256",
          "tenureType":"SLL: Short Life Lse",
          "agreementType":"M: Master Account",
          "service":"3",
          "otherCharge":"678",
          "residents":[{"firstName":"Tweeny","lastName":"Ed","dateOfBirth":"1967-05-17"}]
        },
        {
          "tenancyAgreementReference":"526389/04",
          "address":"2nd Floor Flat",
          "postcode":"N6 TY7",
          "commencementOfTenancyDate":"1987-10-17",
          "endOfTenancyDate":null,
          "currentBalance":"-451.38",
          "present":true,
          "terminated":false,
          "paymentReference":"1072628478",
          "householdReference":"005722",
          "propertyReference":"0088273",
          "tenureType":"SEC: Secure",
          "agreementType":"M: Master Account",
          "service":"19.7",
          "otherCharge":"0.1",
          "residents":[{"firstName":"James","lastName":"Right","dateOfBirth":null}]
        }
      ]
    })
  } else if (req.query.address === 'greenstreet' && req.query.freehold_only === 'true') {
    res.send({
      "tenancies": [
        {
          "tenancyAgreementReference":"526389/04",
          "address":"1st Floor Flat",
          "postcode":"E6 TY7",
          "commencementOfTenancyDate":"2017-10-17",
          "endOfTenancyDate":null,
          "currentBalance":"-51.38",
          "present":true,
          "terminated":false,
          "paymentReference":"1072628478",
          "householdReference":"005722",
          "propertyReference":"0088273",
          "tenureType":"FRE: Freehold",
          "agreementType":"M: Master Account",
          "service":"19.7",
          "otherCharge":"0.1",
          "residents":[{"firstName":"Janny","lastName":"Left","dateOfBirth":null}]
        }
      ]
    })
  } else {
    res.send({ tenancies: []});
  }
});

app.listen(port, () =>
  console.log(`Fake Platform APIs listening on port ${port}!`)
);
