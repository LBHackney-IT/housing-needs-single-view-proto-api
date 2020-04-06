// const path = require('path');
// const request = require('supertest');
// const singleViewDb = require('../../lib/PostgresDb');
// const { app } = require('../../../api');
// const { loadSQL } = require('../../../api/lib/Utils');
// const { dropTablesSQL, getCustomersSQL } = loadSQL(
//   path.join(__dirname, 'sql')
// );
// const { schemaSQL } = loadSQL(
//   path.join(__dirname, '../../../')
// );
//
// jest.mock('jsdom');

// beforeEach(async () => {
//   await singleViewDb.any(schemaSQL);
// });
//
// afterEach(async () => {
//   await singleViewDb.any(dropTablesSQL);
// });

describe('Singleview API', () => {
  // it('can put a customer in local database', async () => {
  //   const response = await request(app)
  //     .post('/customers')
  //     .send({
  //       customers: [
  //         {
  //           id: "abcd/1",
  //           firstName: 'FirstName',
  //           lastName: 'LastName',
  //           dob: '24/07/1981',
  //           nino: 'AB123456A',
  //           address: 'Flat 1, Main Street, London, EC1A 2BC',
  //           postcode: 'EC1A 2BC',
  //           source: 'UHT-Contacts',
  //           links: {
  //             uhContact: 123456
  //           }
  //         }
  //       ]
  //     });
  //
  //   const savedCustomers = await singleViewDb.any(getCustomersSQL);
  //
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body).toEqual({ customer: { id: 1 } });
  //   expect(savedCustomers.length).toEqual(1);
  // });

  const rp = require('request-promise');
  const doSearchRequest = async uri => {
    var options = {
      uri,
      qs: {},
      headers: {
        Connection: 'Keep-Alive'
      },
      json: true
    };

    return await rp(options);
  };

  it('returns empty records for non-existent customer', async () => {
    var response = await doSearchRequest(
      'http://localhost:3000/customers?firstName=john&lastName=smith'
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [],
      connected: []
    });
  });

  it('returns uht record if customer exists in uht', async () => {
    var response = await doSearchRequest(
      'http://localhost:3000/customers?firstName=dani&lastName=beyn'
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          address: '65 Bunker Hill Hill',
          dob: '23/07/1955',
          firstName: 'Dani',
          id: '2966927/2',
          lastName: 'Beyn',
          links: {
            uhContact: 6452
          },
          nino: 'EF926702A',
          postcode: 'N16 5Z',
          source: 'UHT-Contacts'
        }
      ],
      connected: []
    });
  });
});
