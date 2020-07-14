const nock = require('nock');
const searchAPI = require('../../../lib/gateways/Academy-Benefits/SearchAPI');

describe("Search Academy - Benefits using API", () => {

  const createGateway = (records, queryParams = {}) => {
    const apiKey = 'my-super-secure-api-key';
    const baseUrl = 'https://https://our-new-shiny-api';

    nock(baseUrl, {
      reqHeaders: {
        'X-API-Key': apiKey 
      }
    })
    .get('/api/v1/claimants')
    .query(queryParams)
    .reply(200, {claimants: records});
    
    return searchAPI({baseUrl, apiKey})
  };

  it('queries the API for forename if the query contains firstname', async () => {
    const firstName = 'maria';
    const gateway = createGateway([], {first_name: firstName});
    
    await gateway.searchAPI({ firstName });
    
    expect(nock.isDone()).toBe(true);
  })

  it('does not query the API for the forename if the query does not have a firstname', async () => {
    const gateway = createGateway([]);

    await gateway.searchAPI({});

    expect(nock.isDone()).toBe(true);
  });

  it('queries the API for lastname if the query contains lastname', async () => {
    const lastName = 'smith';
    const gateway = createGateway([], {last_name: lastName});

    await gateway.searchAPI({ lastName });

    expect(nock.isDone()).toBe(true);
  });

  it('does not query the API for the lastname if the query does not have a lastname', async () => {
    const gateway = createGateway([]);

    await gateway.searchAPI({});

    expect(nock.isDone()).toBe(true);
  });

  it('returns records from the API', async () => {
    const record = [{
      claimId: 1,
      checkDigit: 'X',
      personRef: 2,
      firstName: 'Maria',
      lastName: 'Woodstock',
      dateOfBirth: '1980-02-01',
      niNumber: 'CH763625R',
      claimantAddress: {
        addressLine1: 'Hackney',
        addressLine2: null,
        addressLine3: null,
        addressLine4: null,
        postCode: 'E1 1JJ',
      }
    }];
    const gateway = createGateway([record]);

    const response = await gateway.searchAPI({});

    expect(response).toEqual([record])
  });
});