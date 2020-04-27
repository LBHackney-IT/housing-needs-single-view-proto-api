require('dotenv').config();
const path = require('path');
const singleViewDb = require('../../lib/PostgresDb');
const { loadSQL } = require('../../../api/lib/Utils');
const { doGetRequest } = require('./TestUtils');
const { truncateTablesSQL, insertLinksSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

describe('Singleview API', () => {
  beforeEach(async () => {
    await singleViewDb.any(truncateTablesSQL);
    await singleViewDb.any(insertLinksSQL);
  });

  afterAll(singleViewDb.$pool.end);

  it('returns empty records for non-existent customer', async () => {
    const response = await doGetRequest(`customers/122/record`);
    expect(response).toStrictEqual({
      customer: false
    });
  });

  it('returns info for customer with UHT-Contacts record', async () => {
    const response = await doGetRequest(`customers/123/record`);
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
    const response = await doGetRequest(`customers/124/record`);
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
    const response = await doGetRequest(`customers/125/record`);
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
    const response = await doGetRequest(`customers/126/record`);
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
    const response = await doGetRequest(`customers/127/record`);
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
    const response = await doGetRequest(`customers/128/record`);
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

  it('returns info for customer existing in all systems', async () => {
    const response = await doGetRequest(`customers/129/record`);
    expect(response).toStrictEqual({
      customer: {
        address: [
          { address: ['1 Mallard Circle'], source: ['UHT-Contacts'] },
          {
            address: ['3 Schlimgen Point'],
            source: ['UHT-HousingRegister-Correspondence']
          },
          {
            address: ['Hackney London W3 43no'],
            source: ['JIGSAW']
          },

          {
            address: [
              '6 Cascade Junction',
              '49 Norway Maple Pass',
              'London',
              'I3 0RP'
            ],
            source: ['ACADEMY-Benefits']
          },
          {
            address: [
              '0 Claremont Alley',
              '6906 Northwestern Avenue',
              'London',
              'I0 5XL'
            ],
            source: ['ACADEMY-CouncilTax-Property']
          },
          {
            address: [
              '8017 Garrison Point',
              '2',
              'Lake View Crossing',
              'London',
              'S3 1EV'
            ],
            source: ['ACADEMY-CouncilTax-Forwarding-Address']
          }
        ],
        benefits: {
          income: [
            {
              amount: 89.56,
              description: 'Future-proofed motivating workforce',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Virtual encompassing internet solution',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Multi-lateral tertiary extranet',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Advanced clear-thinking algorithm',
              frequency: 1,
              period: 'Weekly'
            }
          ],
          live: true
        },
        councilTax: {
          accountBalance: 5,
          paymentMethod: 'Future-proofed motivating workforce',
          transactions: [
            {
              amount: 33.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 1'
            },
            {
              amount: 33.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 3'
            },
            {
              amount: 33.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 5'
            },
            {
              amount: 33.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 8'
            },
            {
              amount: 33.77,
              date: '2019-04-01T00:00:00.000Z',
              description: 'description 0'
            }
          ]
        },
        dob: ['1971-12-22 12:00:00', '1991-02-13 12:00:00'],
        email: ['Elwira.M@yahoo.com', 'james@hotmail.com'],
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
        housingRegister: [
          {
            applicationRef: 'DIR4704058',
            applicationStatus: 'Cancelled',
            band: 'General',
            bedroomReq: '1                   ',
            biddingNo: '2000111',
            startDate: '1900-01-01T00:00:00.000Z'
          }
        ],
        name: [{ first: 'Elwira', last: 'Moncur', title: 'Ms' }],
        nhsNumber: '',
        nino: ['CD877332Z', 'ABC12345D'],
        phone: ['07222222222', '07123456789', '02222222222', '07666666666'],
        postcode: ['N1 5DZ', 'O70 5TH', 'I3 0RP', 'S3 1EV'],
        systemIds: {
          academyBenefits: ['52607656'],
          academyCouncilTax: ['271264421'],
          householdRef: '6867133   ',
          jigsaw: ['12345'],
          paymentRef: '593507764           ',
          rent: '000038/08',
          uhtContacts: '222222',
          uhtHousingRegister: ['DIR4704058/5'],
          uhw: ['8852263']
        },
        team: {},
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
});
