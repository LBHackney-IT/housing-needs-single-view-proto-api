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

  it('can connect a single uht contacts record', async () => {
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

  it('returns academy-benefits record if customer exists in academy-benefits', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=flor&lastName=beden`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          address: '8017 Garrison Point, 2 Lake View Crossing, London, S3 1EV',
          dob: '08/02/1981',
          firstName: 'Flor',
          id: '60605913/2',
          lastName: 'Beden',
          links: {
            hbClaimId: 6060591
          },
          nino: 'CD877342Z',
          postcode: 'S3 1EV',
          source: 'ACADEMY-Benefits'
        }
      ],
      connected: []
    });
  });

  it('returns academy-councilTax record if customer exists in academy-councilTax', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=alf&lastName=roscrigg`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          address: '25 Maple Wood Park, 3 Prairie Rose Alley, London, Q0 0ZE',
          dob: null,
          firstName: 'Alf',
          id: '5244573676',
          lastName: 'Roscrigg',
          links: {
            hbClaimId: null
          },
          nino: null,
          postcode: 'Q0 0ZE',
          source: 'ACADEMY-CouncilTax'
        }
      ],
      connected: []
    });
  });

  it('returns UHT-housingRegister record if customer exists in UHT-housingRegister', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=Imojean&lastName=D'Abbot-Doyle`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          address: '56264 Westport Lane',
          dob: '18/05/1971',
          firstName: 'Imojean',
          id: 'DIR5135951/3',
          lastName: "D'abbot-doyle",
          links: {
            uhContact: 302934398
          },
          nino: 'CC808991F',
          postcode: 'DT0 0AX',
          source: 'UHT-HousingRegister'
        }
      ],
      connected: []
    });
  });

  it('returns UHW record if customer exists in UHW', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=Melisa&lastName=hansbury`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          address: '',
          dob: '27/04/1954',
          firstName: 'Melisa',
          id: '9589034',
          lastName: 'Hansbury',
          links: {
            uhContact: 9229870
          },
          nino: 'HB4070802G',
          postcode: null,
          source: 'UHW'
        }
      ],
      connected: []
    });
  });

  it('Can get a record from Jigsaw', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=firstname&lastName=lastname`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          id: '123',
          firstName: 'Firstname',
          lastName: 'Lastname',
          dob: '06/11/1974',
          nino: 'SS111111A',
          address: '1 The Streets',
          source: 'JIGSAW'
        }
      ],
      connected: []
    });
  });

  it('Groups search records from all systems if they have same name, nino and dob', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=elwira&lastName=moncur`
    );
    expect(response).toStrictEqual({
      grouped: [
        [
          {
            address: 'Address',
            dob: '22/12/1971',
            firstName: 'Elwira',
            id: '123',
            lastName: 'Moncur',
            nino: 'CD877332Z',
            source: 'JIGSAW'
          },
          {
            address: '6 Cascade Junction, 49 Norway Maple Pass, London, I3 0RP',
            dob: '22/12/1971',
            firstName: 'Elwira',
            id: '52607656/1',
            lastName: 'Moncur',
            links: {
              hbClaimId: 5260765
            },
            nino: 'CD877332Z',
            postcode: 'I3 0RP',
            source: 'ACADEMY-Benefits'
          },
          {
            address:
              '0 Claremont Alley, 6906 Northwestern Avenue, London, I0 5XL',
            dob: null,
            firstName: 'Elwira',
            id: '271264421',
            lastName: 'Moncur',
            links: {
              hbClaimId: 5260765
            },
            nino: null,
            postcode: 'I0 5XL',
            source: 'ACADEMY-CouncilTax'
          },
          {
            address: '3 Schlimgen Point',
            dob: '22/12/1971',
            firstName: 'Elwira',
            id: 'DIR4704058/5',
            lastName: 'Moncur',
            links: {
              uhContact: 530672748
            },
            nino: 'CD877332Z',
            postcode: 'O70 5TH',
            source: 'UHT-HousingRegister'
          },
          {
            address: '',
            dob: '22/12/1971',
            firstName: 'Elwira',
            id: '8852263',
            lastName: 'Moncur',
            links: {
              uhContact: 9802781
            },
            nino: 'CD877332Z',
            postcode: null,
            source: 'UHW'
          },
          {
            address: '1 Mallard Circle',
            dob: '22/12/1971',
            firstName: 'Elwira',
            id: '6867133/2',
            lastName: 'Moncur',
            links: {
              uhContact: 7250
            },
            nino: 'CD877332Z',
            postcode: 'N1 5DZ',
            source: 'UHT-Contacts'
          }
        ]
      ],
      ungrouped: [],
      connected: []
    });
  });

  it('Groups search records based on claim ID', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=tate&lastName=Bullimore`
    );
    expect(response).toStrictEqual({
      grouped: [
        [
          {
            address: '8 Schlimgen Terrace, 5111 Basil Avenue, London, E0 1MO',
            dob: '25/09/1971',
            firstName: 'Tate',
            id: '57597440/1',
            lastName: 'Bullimore',
            links: {
              hbClaimId: 5759744
            },
            nino: 'CD877534Z',
            postcode: 'E0 1MO',
            source: 'ACADEMY-Benefits'
          },
          {
            address: '50884 Westridge Road, 79 Talisman Point, London, G6 7UB',
            dob: null,
            firstName: 'Tate',
            id: '256644324',
            lastName: 'Bullimore',
            links: {
              hbClaimId: 5759744
            },
            nino: null,
            postcode: 'G6 7UB',
            source: 'ACADEMY-CouncilTax'
          }
        ]
      ],
      ungrouped: [],
      connected: []
    });
  });

  it('Does not group search records only based on name', async () => {
    const response = await doSearchRequest(
      `${BASE_URL}/customers?firstName=Hartwell&lastName=lorinez`
    );
    expect(response).toStrictEqual({
      grouped: [],
      ungrouped: [
        {
          address: '55 Pankratz Point',
          dob: '24/05/1942',
          firstName: 'Hartwell',
          id: '8282501/1',
          lastName: 'Lorinez',
          links: {
            uhContact: 6976
          },
          nino: 'ST949511G',
          postcode: 'N3 6Z',
          source: 'UHT-Contacts'
        },
        {
          address: '3 Coolidge Park',
          dob: '15/12/1979',
          firstName: 'Hartwell',
          id: 'DIR1784557/2',
          lastName: 'Lorinez',
          links: {
            uhContact: 172168279
          },
          nino: 'KK933624D',
          postcode: 'T34 9II',
          source: 'UHT-HousingRegister'
        }
      ],
      connected: []
    });
  });
});
