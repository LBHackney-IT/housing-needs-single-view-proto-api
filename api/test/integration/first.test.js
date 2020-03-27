const path = require('path');
const request = require('supertest');
const singleViewDb = require('../../lib/PostgresDb');
const { app } = require('../../../api');
const { loadSQL } = require('../../../api/lib/Utils');
const { dropTablesSQL, getCustomersSQL } = loadSQL(
  path.join(__dirname, 'sql')
);
const { schemaSQL } = loadSQL(
  path.join(__dirname, '../../../')
);

jest.mock('jsdom');

beforeEach(async () => {
  await singleViewDb.any(schemaSQL);
});

afterEach(async () => {
  await singleViewDb.any(dropTablesSQL);
});

describe('Singleview API', () => {
  it('can put a customer in local database', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        customers: [
          {
            id: "abcd/1",
            firstName: 'FirstName',
            lastName: 'LastName',
            dob: '24/07/1981',
            nino: 'AB123456A',
            address: 'Flat 1, Main Street, London, EC1A 2BC',
            postcode: 'EC1A 2BC',
            source: 'UHT-Contacts',
            links: {
              uhContact: 123456
            }
          }
        ]
      });

    const savedCustomers = await singleViewDb.any(getCustomersSQL);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ customer: { id: 1 } });
    expect(savedCustomers.length).toEqual(1);
  });
});
