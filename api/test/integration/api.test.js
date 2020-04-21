require('dotenv').config();
const path = require('path');
const singleViewDb = require('../../lib/PostgresDb');
const { loadSQL } = require('../../../api/lib/Utils');
const { truncateTablesSQL, insertLinksSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

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

  beforeEach(() => {
    return singleViewDb.any(truncateTablesSQL);
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

  it('returns empty records for non-existent customer', async () => {
    const response = await doSearchRequest(`${BASE_URL}/customers/123/record`);
    expect(response).toStrictEqual({
      customer: false
    });
  });

  it('returns info for customer with UHT-Contacts record', async () => {
    await singleViewDb.any(insertLinksSQL);
    const response = await doSearchRequest(`${BASE_URL}/customers/123/record`);
    expect(response).toStrictEqual({
      customer: {
        address: [
          {
            address: ['1 Mallard Circle'],
            source: ['UHT-Contacts']
          }
        ],
        dob: ['1971-12-22 12:00:00'],
        housingNeeds: {},
        housingRegister: [],
        name: [
          {
            first: 'Elwira',
            last: 'Moncur',
            title: 'Ms'
          }
        ],
        nino: ['CD877332Z'],
        phone: ['07222222222', '07123456789', '02222222222'],
        postcode: ['N1 5DZ'],
        systemIds: {
          householdRef: '6867133   ',
          paymentRef: '593507764           ',
          rent: '000038/08',
          uhtContacts: '222222'
        },
        tenancies: {
          current: [],
          previous: [
            {
              address: [
                '7433 Armistice Pass',
                '07777 Claremont Terrace',
                'Hackney',
                'London',
                'Dv9 17v'
              ],
              currentBalance: -669.98,
              endDate: '2018-03-21T00:00:00.000Z',
              propRef: '579165050',
              rentAmount: 0,
              startDate: '2005-11-08T00:00:00.000Z',
              tagRef: '000038/08',
              tenure: 'STERIS plc'
            }
          ]
        }
      }
    });
  });

  it('returns info for customer with UHT-Housing Register record', async () => {
    await singleViewDb.any(insertLinksSQL);
    const response = await doSearchRequest(`${BASE_URL}/customers/124/record`);
    const dobMatcher = expect.arrayContaining([
      expect.stringContaining('1965-03-25')
    ]);
    expect(response).toStrictEqual({
      customer: {
        address: [
          {
            address: ['26 Toban Junction'],
            source: ['UHT-HousingRegister-Correspondence']
          }
        ],
        dob: dobMatcher,
        housingNeeds: {},
        housingRegister: [
          {
            applicationRef: 'DIR6940111',
            applicationStatus: 'Cancelled',
            band: 'Urgent',
            bedroomReq: '1                   ',
            biddingNo: '2000111',
            startDate: '1900-01-01T00:00:00.000Z'
          }
        ],
        name: [
          {
            first: 'Hillel',
            last: 'Lorenz',
            title: 'Mr'
          }
        ],
        nino: ['AB106755C'],
        phone: [],
        postcode: ['H04 7OT'],
        systemIds: {
          uhtHousingRegister: ['DIR6940111/4']
        }
      }
    });
  });

  it('returns info for customer with UHT-Contacts record', async () => {
    await singleViewDb.any(insertLinksSQL);
    const response = await doSearchRequest(`${BASE_URL}/customers/125/record`);
    expect(response).toStrictEqual({
      customer: {
        dob: ['1973-08-23 01:00:00'],
        email: ['Arlyn.W@yahoo.com'],
        housingNeeds: {},
        housingRegister: [],
        name: [{ first: 'Arlyn', last: 'Wilce', title: 'Ms' }],
        postcode: [],
        systemIds: { uhw: ['4186867'] }
      }
    });
  });

  xit('returns info for customer with Jigsaw record', async () => {
    await singleViewDb.any(insertLinksSQL);
    const response = await doSearchRequest(`${BASE_URL}/customers/126/record`);
    expect(response).toStrictEqual();
  });

  it('returns info for customer with Academy-Benefits record', async () => {
    await singleViewDb.any(insertLinksSQL);
    const response = await doSearchRequest(`${BASE_URL}/customers/127/record`);
    expect(response).toStrictEqual({
      customer: {
        address: [
          {
            address: [
              '8017 Garrison Point',
              '2 Lake View Crossing',
              'London',
              'S3 1EV'
            ],
            source: ['ACADEMY-Benefits']
          }
        ],
        benefits: {
          income: [
            {
              amount: 2.03,
              description: 'Future-proofed motivating workforce',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 2.03,
              description: 'Virtual encompassing internet solution',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 2.03,
              description: 'Multi-lateral tertiary extranet',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 2.03,
              description: 'Advanced clear-thinking algorithm',
              frequency: 1,
              period: 'Weekly'
            }
          ],
          live: false
        },
        dob: ['1981-02-08 12:00:00'],
        housingNeeds: {},
        housingRegister: [],
        name: [{ first: 'Flor', last: 'Beden', title: 'Mr' }],
        nino: ['CD877342Z'],
        postcode: ['S3 1EV'],
        systemIds: { academyBenefits: ['60605913'] }
      }
    });
  });

  it('returns info for customer with Academy-CouncilTax record', async () => {
    await singleViewDb.any(insertLinksSQL);
    const response = await doSearchRequest(`${BASE_URL}/customers/128/record`);
    expect(response).toStrictEqual();
  });
});
