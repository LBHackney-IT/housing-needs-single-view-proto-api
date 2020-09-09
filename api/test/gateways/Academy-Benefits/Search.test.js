const academyBenefitsSearch = require('../../../lib/gateways/Academy-Benefits/Search');
const nock = require('nock');

describe('AcademyBenefitsSearchGateway', () => {
  const apiToken = 'my-super-secure-api-key';
  const baseUrl = 'https://https://our-new-shiny-api';
  let buildSearchRecord;
  let logger;

  const mockRequest = (claimants, queryParams, nextCursor) => {
    nock(baseUrl, {
      reqheaders: {
        'Authorization': `Bearer ${apiToken}`
      }
    }).get('/api/v1/claimants')
    .query({...queryParams, limit: 100})
    .reply(200, { claimants, nextCursor });
  }

  const mockRequestError = () => {
    nock(baseUrl, {
      reqheaders: {
        'Authorization': `Bearer ${apiToken}`
      }
    }).get('/api/v1/claimants')
    .query({limit: 100})
    .reply(500, "Really bad error")
  }

  const createGateway = ({ claimants = [], throwsApiError = false, queryParams = {}, nextCursor = '' }) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    if (throwsApiError) {
      mockRequestError()      
    } else {
      mockRequest(claimants, queryParams, nextCursor);
    }

    logger = {
      error: jest.fn((msg, err) => { }),
      log: jest.fn()
    };

    return academyBenefitsSearch({
      baseUrl,
      apiToken,
      buildSearchRecord,
      logger
    });
  };

  it('queries the API for forename if the query contains firstname', async () => {
    const firstName = 'maria';
    const gateway = createGateway({ queryParams: { first_name: firstName }});

    await gateway.execute({ firstName });

    expect(nock.isDone()).toBe(true);
  })

  it('queries the API for lastname if the query contains lastname', async () => {
    const lastName = 'smith';
    const gateway = createGateway({queryParams: { last_name: lastName }});

    await gateway.execute({ lastName });

    expect(nock.isDone()).toBe(true);
  });

  it('does not query the API if there are no query parameters', async () => {
    const gateway = createGateway({});

    await gateway.execute({});

    expect(nock.isDone()).toBe(true);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const gateway = createGateway({ throwsApiError: true });

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in Academy-Benefits API: Really bad error',
      expect.anything()
    );
  });

  it('returns the API records if the API call is successfull', async () => {
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
        postcode: 'E1 1JJ',
      }
    };
    const gateway = createGateway({ claimants: [record] });

    const response = await gateway.execute({});

    const recordMatcher = expect.objectContaining({ id: '123X/2' });
    const addressMatcher = expect.objectContaining({ address: ['Hackney', null, null, null, 'E1 1JJ']})

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
    expect(buildSearchRecord).toHaveBeenCalledWith(addressMatcher);
    expect(response.length).toBe(1);
  });

  it("doesn't return a record if any of the id components are missing", async () => {
    const record = { claimId: '123', checkDigit: 'd' };
    const gateway = createGateway({claimants: [record]});

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('gets all pages of results from the API', async () => {
    const records = [
      { claimId: '123', checkDigit: 'd', personRef: '1' },
      { claimId: '342', checkDigit: 'r', personRef: '2' },
      { claimId: '777', checkDigit: 't', personRef: '1' },
    ]
    const gateway = createGateway({claimants: [records[0]], nextCursor: '1234-45-2'});

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
    const gateway = createGateway({claimants: [records[0]], nextCursor: '1234-45-2'});

    mockRequest([records[1]], {cursor: '1234-45-2'}, '378-98-92');
    mockRequest([records[2]], {cursor: '378-98-92'}, '');

    const response = await gateway.execute({});

    expect(response).toEqual([{ id: '123d/1' }, {id: '342r/2'}, {id: '777t/1'}])
  });
});
