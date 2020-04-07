describe('Singleview API', () => {
  const path = require('path');
  const singleViewDb = require('../../lib/PostgresDb');
  const { loadSQL } = require('../../../api/lib/Utils');
  const { dropTablesSQL } = loadSQL(path.join(__dirname, 'sql'));
  const { schemaSQL } = loadSQL(path.join(__dirname, '../../../'));

  jest.mock('jsdom');

  beforeEach(async () => {
    await singleViewDb.any(schemaSQL);
  });

  afterEach(async () => {
    await singleViewDb.any(dropTablesSQL);
  });

  const rp = require('request-promise');
  const doSearchRequest = async uri => {
    var options = {
      uri,
      qs: {},
      json: true
    };

    return await rp(options);
  };

  const doPostRequest = async (uri, body) => {
    var options = {
      method: 'POST',
      uri,
      body,
      json: true
    };
    return await rp(options);
  };

  const doDeleteRequest = async uri => {
    var options = {
      method: 'DELETE',
      uri
    };
    return await rp(options);
  };

  // it('returns empty records for non-existent customer', async () => {
  //   var response = await doSearchRequest(
  //     'http://localhost:3000/customers?firstName=john&lastName=smith'
  //   );
  //   expect(response).toStrictEqual({
  //     grouped: [],
  //     ungrouped: [],
  //     connected: []
  //   });
  // });

  // it('returns uht record if customer exists in uht', async () => {
  //   var response = await doSearchRequest(
  //     'http://localhost:3000/customers?firstName=dani&lastName=beyn'
  //   );
  //   expect(response).toStrictEqual({
  //     grouped: [],
  //     ungrouped: [
  //       {
  //         address: '65 Bunker Hill Hill',
  //         dob: '23/07/1955',
  //         firstName: 'Dani',
  //         id: '2966927/2',
  //         lastName: 'Beyn',
  //         links: {
  //           uhContact: 6452
  //         },
  //         nino: 'EF926702A',
  //         postcode: 'N16 5Z',
  //         source: 'UHT-Contacts'
  //       }
  //     ],
  //     connected: []
  //   });
  // });

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
    await doPostRequest(`http://localhost:3000/customers`, data);

    var response = await doSearchRequest(
      'http://localhost:3000/customers?firstName=Henrieta&lastName=sterre'
    );

    const paramMatcher = expect.objectContaining({
      connected: expect.arrayContaining([
        expect.objectContaining({ firstName: 'Henrieta' })
      ])
    });

    expect(response).toStrictEqual(paramMatcher);
  });

  // it('control test', async () => {
  //   var response = await doSearchRequest(
  //     'http://localhost:3000/customers?firstName=john&lastName=smith'
  //   );
  //   expect(response).toStrictEqual({
  //     grouped: [],
  //     ungrouped: [],
  //     connected: []
  //   });
  // });
});
