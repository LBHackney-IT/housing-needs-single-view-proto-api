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

  beforeEach(async () => {
    await singleViewDb.any(truncateTablesSQL);
    await singleViewDb.any(insertLinksSQL);
  });

  afterAll(singleViewDb.$pool.end);

  it('returns empty records for non-existent customer', async () => {
    const response = await doSearchRequest(`${BASE_URL}/customers/122/record`);
    expect(response).toStrictEqual({
      customer: false
    });
  });

  it('returns info for customer with UHT-Contacts record', async () => {
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
              tenure: 'FactSet Res'
            }
          ]
        }
      }
    });
  });

  it('returns info for customer with UHT-Housing Register record', async () => {
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
    const dobMatcher = expect.arrayContaining([
      expect.stringContaining('1973-08-23')
    ]);
    const response = await doSearchRequest(`${BASE_URL}/customers/125/record`);
    expect(response).toStrictEqual({
      customer: {
        dob: dobMatcher,
        email: ['Arlyn.W@yahoo.com'],
        housingNeeds: {},
        housingRegister: [],
        name: [{ first: 'Arlyn', last: 'Wilce', title: 'Ms' }],
        postcode: [],
        systemIds: { uhw: ['4186867'] }
      }
    });
  });

  it('returns info for customer with Jigsaw record', async () => {
    const response = await doSearchRequest(`${BASE_URL}/customers/126/record`);
    expect(response).toStrictEqual({
      customer: {
        address: [{ address: ['Hackney London W3 43no'], source: ['JIGSAW'] }],
        dob: ['1991-02-13 12:00:00'],
        email: ['james@hotmail.com'],
        housingNeeds: {
          currentPlacement: {
            address: 'Room 1 hallway drive ',
            duty: 'Section 192',
            rentCostCustomer: 0,
            startDate: '2019-04-05 12:00:00',
            tenancyId: 64444,
            type: 'Accommodation secured by the Local Authority'
          },
          jigsawCaseId: '54321',
          status: 'Open'
        },
        housingRegister: [],
        nhsNumber: '',
        nino: ['ABC12345D'],
        phone: ['07666666666'],
        systemIds: { jigsaw: ['12345'] },
        team: {}
      }
    });
  });

  it('returns info for customer with Academy-Benefits record', async () => {
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
    const response = await doSearchRequest(`${BASE_URL}/customers/128/record`);
    expect(response).toStrictEqual({
      customer: {
        address: [
          {
            address: [
              '92548 Kensington Junction',
              '090 Dixon Junction',
              'London',
              'N9 8CK'
            ],
            source: ['ACADEMY-CouncilTax-Property']
          },
          {
            address: [
              '320 Little Fleur Way',
              '62',
              'Warrior Avenue',
              'London',
              'L0 3DM'
            ],
            source: ['ACADEMY-CouncilTax-Forwarding-Address']
          }
        ],
        councilTax: {
          accountBalance: 14,
          paymentMethod: 'Future-proofed motivating workforce',
          transactions: [
            {
              amount: 32.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 4'
            },
            {
              amount: 32.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 7'
            }
          ]
        },
        housingNeeds: {},
        housingRegister: [],
        name: [{ first: 'Val', last: 'Ollivier', title: 'Mrs' }],
        postcode: ['L0 3DM'],
        systemIds: { academyCouncilTax: ['352059099'] }
      }
    });
  });
});
