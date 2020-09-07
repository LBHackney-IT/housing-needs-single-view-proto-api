const nock = require('nock');
const tenanciesApi = require('../../../lib/gateways/Tenancies/TenanciesApi')

describe('Tenancies API', () => {
  const baseUrl = 'https://tenancies-api.com'
  const token = 'my-token';
  let logger;

  mockApiRequest = (queryParams, tenancies, nextCursor) => {
    nock(`${baseUrl}`, {
      reqheaders: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).get('/api/v1/tenancies')
      .query({ ...queryParams, limit: 100 })
      .reply(200, { tenancies, nextCursor })
  }

  mockApiThrowingError = (queryParams) => {
    nock(`${baseUrl}`, {
      reqheaders: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).get('/api/v1/tenancies')
      .query({ ...queryParams, limit: 100 })
      .reply(500, 'Really bad error')
  }

  createGateway = () => {
    logger = {
      error: jest.fn()
    }
    return tenanciesApi({
      baseUrl,
      token,
      logger
    });
  }

  it('Calls the API endpoint with limit query', async () => {
    mockApiRequest({}, []);
    const gateway = createGateway();
    await gateway.search({});

    expect(nock.isDone()).toBe(true);
  });

  it('Queries API for address, if given', async () => {
    const address = 'this random address 4';
    mockApiRequest({ address }, []);
    const gateway = createGateway();
    await gateway.search({ address });

    expect(nock.isDone()).toBe(true);
  });

  it('Queries API for only freehold agreements', async () => {
    mockApiRequest({ freehold_only: true }, []);
    const gateway = createGateway();
    await gateway.search({ freehold_only: true });

    expect(nock.isDone()).toBe(true);
  });

  it('Queries API for only leasehold agreements', async () => {
    mockApiRequest({ leasehold_only: true }, []);
    const gateway = createGateway();
    await gateway.search({ leasehold_only: true });

    expect(nock.isDone()).toBe(true);
  });

  it('Returns tenancies retrieved from the API', async () => {
    const tenancies = [
      {
        address: '4 adress',
        name: 'my name',
        currentBalance: '345'
      },
      {
        tenancyAgreementReference: "526389/04",
        address: "1st Floor Flat",
        postcode: "E6 TY7",
        commencementOfTenancyDate: "2017-10-17",
        currentBalance: "-51.38",
        present: true
      }
    ]
    mockApiRequest({}, tenancies);
    const gateway = createGateway();
    const response = await gateway.search({});
    expect(response).toEqual({ tenancies: tenancies });
  });

  it('Pages through tenancies returned from the API', async () => {
    const pageOneTenancies = [
      { tenancyAgreementReference: 'ten1' },
      { tenancyAgreementReference: 'ten2' }
    ];
    const pageTwoTenancies = [
      { tenancyAgreementReference: 'ten3' }
    ];
    mockApiRequest({}, pageOneTenancies, 'next-cursor');
    mockApiRequest({ cursor: 'next-cursor' }, pageTwoTenancies);
    const gateway = createGateway();
    const response = await gateway.search({});
    expect(response).toEqual({ tenancies: [...pageOneTenancies, ...pageTwoTenancies] });
  });

  it('Calls the logger if the API throws an error', async () => {
    mockApiThrowingError({})
    const gateway = createGateway();
    await gateway.search({})
    expect(logger.error).toHaveBeenCalledWith(
      "Search tenancies: Error calling the tenancy API. 500 - \"Really bad error\"",
      expect.anything()
    );
  });

  it('Returns an empty array if the API throws an error', async () => {
    mockApiThrowingError({})
    const gateway = createGateway();
    const resposne = await gateway.search({})
    expect(resposne).toEqual({ tenancies: [] })
  });
});