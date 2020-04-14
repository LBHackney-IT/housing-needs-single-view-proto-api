require('dotenv').config();
const path = require('path');
const singleViewDb = require('../../lib/PostgresDb');
const { loadSQL } = require('../../../api/lib/Utils');
const { truncateTablesSQL } = loadSQL(path.join(__dirname, 'sql'));

const BASE_URL = 'http://localhost:3010';

describe('Singleview API', () => {
  const rp = require('request-promise');
  const doSearchRequest = async uri => {
    const options = {
      uri,
      qs: {},
      json: true
    };
    return await rp(options);
  };

  const doPostRequest = async (uri, body) => {
    const options = {
      method: 'POST',
      uri,
      body,
      json: true
    };
    return await rp(options);
  };

  const doDeleteRequest = async uri => {
    const options = {
      method: 'DELETE',
      uri
    };
    return await rp(options);
  };

  beforeEach(async done => {
    await singleViewDb.any(truncateTablesSQL);
    return done();
  });

  afterAll(singleViewDb.$pool.end);

  it('returns empty records for non-existent customer', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=john&lastName=smith`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [],
      connected: []
    });
  });

  it('returns uht record if customer exists in uht', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=dani&lastName=beyn`
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

  it('can connect a single uht record', async () => {
    const data = {
      customers: [
        {
          address: '8019 Mariners Cove Lane',
          dob: '17/03/1999',
          firstName: 'Henrieta',
          id: '8381960/1',
          lastName: 'Sterre',
          links: {
            uhContact: 5380
          },
          nino: 'NO884836E',
          postcode: 'A2 B4',
          source: 'UHT-Contacts'
        }
      ]
    };
    await doPostRequest(`${BASE_URL}/customers`, data);

    const result = await doSearchRequest(
      `${BASE_URL}/customers?firstName=Henrieta&lastName=sterre`
    );

    const paramMatcher = expect.objectContaining({
      connected: expect.arrayContaining([
        expect.objectContaining({ firstName: 'Henrieta' })
      ])
    });
    expect(result).toStrictEqual(paramMatcher);
  });

  it('can disconnect a uht record', async () => {
    // connect a record first
    const data = {
      customers: [
        {
          address: '8019 Mariners Cove Lane',
          dob: '17/03/1999',
          firstName: 'Henrieta',
          id: '8381960/1',
          lastName: 'Sterre',
          links: {
            uhContact: 5380
          },
          nino: 'NO884836E',
          postcode: 'A2 B4',
          source: 'UHT-Contacts'
        }
      ]
    };
    await doPostRequest(`${BASE_URL}/customers`, data);

    // now disconnect the record
    const deleteResponse = await doDeleteRequest(`${BASE_URL}/customers/1`);

    expect(deleteResponse).toEqual('OK');

    const result = await doSearchRequest(
      `${BASE_URL}/customers?firstName=Henrieta&lastName=sterre`
    );

    const paramMatcher = expect.objectContaining({
      ungrouped: expect.arrayContaining([
        expect.objectContaining({ firstName: 'Henrieta' })
      ])
    });

    expect(result).toStrictEqual(paramMatcher);
  });
});
