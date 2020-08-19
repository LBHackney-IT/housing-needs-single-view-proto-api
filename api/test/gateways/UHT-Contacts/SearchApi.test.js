const UHTContactsSearch = require('../../../lib/gateways/UHT-Contacts/SearchApi');
const nock = require('nock');

describe('UHTContactsSearchAPIGateway', () => {
  let buildSearchRecord;
  let logger;
  const baseUrl = 'https://universal-housing.com';
  const apiKey = 'secret-secret-secret';
  const fullApiResponse = {
    houseReference: '123',
    personNumber: 3,
    tenancyReference: '123/3',
    firstName: 'Jim',
    lastName: 'Jones',
    dateOfBirth: '1982-05-15T00:00:00.0000000',
    niNumber: 'CD98765273E',
    uprn: '0937452829',
    housingWaitingListContactKey: '12197',
    phoneNumbers: [{
      phoneNumber: '09876543212',
      phoneType: 'Mobile',
      lastModified: '2020-05-15T00:00:00.0000000'
    }],
    emailAddresses: [{
      emailAddress: 'hello@email.com',
      lastModified: '2020-05-15T00:00:00.0000000'
    }],
    address: {
      propertyRef: '12345',
      addressLine1: '3 my road',
      postcode: 'LND 123'
    }
  }
  const mockRequest = (households, queryParams, nextCursor = '') => {
    nock(baseUrl, {
      reqHeaders: {
        'X-API-Key': apiKey
      }
    }).get('/api/v1/households')
    .query({...queryParams, limit: 100})
    .reply(200, { households, nextCursor });
  }
  const mockRequestError = (queryParams) => {
    nock(baseUrl, {
      reqHeaders: {
        'X-API-Key': apiKey
      }
    }).get('/api/v1/households')
    .query({...queryParams, limit: 100})
    .reply(500, 'Unknown API Error');
  }

  const createGateway = ({records = [], throwsError = false, queryParams = {}, nextCursor = ''}) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    if (throwsError) {
      mockRequestError(queryParams)
    } else {
      mockRequest(records, queryParams, nextCursor) 
    }

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return UHTContactsSearch({
      buildSearchRecord,
      baseUrl,
      apiKey,
      logger
    });
  };

  it('queries the api for forename if the query contains firstname', async () => {
    const firstName = 'maria';
    const gateway = createGateway({queryParams: {first_name: firstName}});

    await gateway.execute({ firstName });

    expect(nock.isDone()).toBe(true);
  });

  it('does not set any query parameters for the request if there are none', async () => {
    const gateway = createGateway({queryParams: {}});

    await gateway.execute({});

    expect(nock.isDone()).toBe(true);
  });

  it('queries the api for surname if the query contains surname', async () => {
    const lastName = 'smith';
    const gateway = createGateway({queryParams: {last_name: lastName}});

    await gateway.execute({ lastName });

    expect(nock.isDone()).toBe(true);
  });

  it('returns record if all id components exist', async () => {
    const record = { houseReference: '123 ', personNumber: 'd' };
    const gateway = createGateway({records: [record]});
    const recordMatcher = expect.objectContaining({ id: '123/d' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns all needed fields from a record', async () => {
    const gateway = createGateway({records: [fullApiResponse]});

    const recordMatcher = expect.objectContaining({
      id: '123/3',
      firstName: 'Jim',
      lastName: 'Jones',
      dob: '1982-05-15T00:00:00.0000000',
      nino: 'CD98765273E',
      postcode: 'LND 123',
      address: '3 my road',
      links: { uhContact: '12197' }
    });
    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
  });

  it("doesn't return a record if any of the id components are missing", async () => {
    const record = { houseReference: '123 ' };
    const gateway = createGateway({records: [record]});

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const record = { account_ref: '123', account_cd: '1' };
    const gateway = createGateway({records: [record], throwsError:  true});

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in Housing API: 500 - \"Unknown API Error\"',
      expect.anything()
    );
  });

  it('gets all pages of results from the API', async () => {
    const records = [
      { houseReference: '123', personNumber: '1' },
      { houseReference: '342', personNumber: '2' },
      { houseReference: '777', personNumber: '1' },
    ]
    const gateway = createGateway({records: [records[0]], nextCursor: '1234-45-2'});

    mockRequest([records[1]], {cursor: '1234-45-2'}, '378-98-92');
    mockRequest([records[2]], {cursor: '378-98-92'}, '');

    await gateway.execute({});

    expect(nock.isDone()).toBe(true);
  });

  it('returns results from all pages', async () => {
    const records = [
      { houseReference: '123', personNumber: '1' },
      { houseReference: '342', personNumber: '2' },
      { houseReference: '777', personNumber: '1' },
    ]
    const gateway = createGateway({ records: [records[0]], nextCursor: '1234-45-2'});

    mockRequest([records[1]], {cursor: '1234-45-2'}, '378-98-92');
    mockRequest([records[2]], {cursor: '378-98-92'}, '');

    const response = await gateway.execute({});

    expect(response).toEqual([{ id: '123/1' }, {id: '342/2'}, {id: '777/1'}])
  });
});
