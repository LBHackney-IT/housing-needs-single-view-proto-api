const nock = require('nock');
const searchAPI = require('../../../lib/gateways/Academy-Benefits/SearchAPI');

describe("Search Academy - Benefits using API", () => {
  const apiKey = 'my-super-secure-api-key';
  const baseUrl = 'https://https://our-new-shiny-api';

  const mockRequest = (claimants, queryParams, nextCursor) => {
    nock(baseUrl, {
      reqHeaders: {
        'X-API-Key': apiKey
      }
    }).get('/api/v1/claimants')
    .query({...queryParams, limit: 100})
    .reply(200, { claimants, nextCursor });
  }

  const createGateway = (claimants, queryParams = {}, nextCursor = '') => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    mockRequest(claimants, queryParams, nextCursor);

    return searchAPI({
      baseUrl,
      apiKey,
      buildSearchRecord
    })
  };

  it('queries the API for forename if the query contains firstname', async () => {
    const firstName = 'maria';
    const gateway = createGateway([], { first_name: firstName });

    await gateway.execute({ firstName });

    expect(nock.isDone()).toBe(true);
  })

  it('does not query the API for the forename if the query does not have a firstname', async () => {
    const gateway = createGateway([]);

    await gateway.execute({});

    expect(nock.isDone()).toBe(true);
  });

  it('queries the API for lastname if the query contains lastname', async () => {
    const lastName = 'smith';
    const gateway = createGateway([], { last_name: lastName });

    await gateway.execute({ lastName });

    expect(nock.isDone()).toBe(true);
  });

  it('does not query the API for the lastname if the query does not have a lastname', async () => {
    const gateway = createGateway([]);

    await gateway.execute({});

    expect(nock.isDone()).toBe(true);
  });

  it('returns record if all id components exist', async () => {
    const record = {
      claimId: 123,
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
    };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '123X/2' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
    expect(records.length).toBe(1);
  });

  it("doesn't return a record if any of the id components are missing", async () => {
    const record = { claimId: '123', checkDigit: 'd' };
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns records from the database', async () => {
    const record = { claimId: '123', checkDigit: 'd', personRef: '1' };
    const gateway = createGateway([record]);

    const response = await gateway.execute({});

    expect(response).toEqual([{ id: '123d/1' }])
  });

  it('gets all pages of results from the API', async () => {
    const records = [
      { claimId: '123', checkDigit: 'd', personRef: '1' },
      { claimId: '342', checkDigit: 'r', personRef: '2' },
      { claimId: '777', checkDigit: 't', personRef: '1' },
    ]
    const gateway = createGateway([records[0]], {}, '1234-45-2');

    mockRequest([records[1]], {cursor: '1234-45-2'}, '378-98-92');
    mockRequest([records[2]], {cursor: '378-98-92'}, '');

    await gateway.execute({});

    expect(nock.isDone()).toBe(true);
  });

  it('returns results from all pages', async () => {
    const records = [
      { claimId: '123', checkDigit: 'd', personRef: '1' },
      { claimId: '342', checkDigit: 'r', personRef: '2' },
      { claimId: '777', checkDigit: 't', personRef: '1' },
    ]
    const gateway = createGateway([records[0]], {}, '1234-45-2');

    mockRequest([records[1]], {cursor: '1234-45-2'}, '378-98-92');
    mockRequest([records[2]], {cursor: '378-98-92'}, '');

    const response = await gateway.execute({});

    expect(response).toEqual([{ id: '123d/1' }, {id: '342r/2'}, {id: '777t/1'}])
  });
});