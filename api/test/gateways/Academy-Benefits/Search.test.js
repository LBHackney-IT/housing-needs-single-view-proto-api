const academyBenefitsSearch = require('../../../lib/gateways/Academy-Benefits/Search');

describe('AcademyBenefitsSearchGateway', () => {
  let buildSearchRecord;
  let logger;
  let searchDb;
  let searchAPI;
  const dbError = new Error('Database error');
  const apiError = new Error('API Error');
  const randomRecord1 = { firstName: 'Joe', nino: 'Dx231234f', lastName: 'bloggs', id: `123d/1`, };
  const randomRecord2 = { firstName: 'Sarah', nino: 'HG231234f', lastName: 'blake', id: `144e/2`, };
  const randomRecordWithAllFields = {
    firstName: 'Joe',
    nino: 'Dx231234f',
    lastName: 'bloggs',
    id: `123d/1`,
    dob: '2018-03-01',
    postcode: 'E1 1JT',
  };

  const createGateway = ({ dbRecords = [], apiRecords = [], throwsDbError = false, throwsApiError = false }) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    searchDb = {
      execute: jest.fn(async (queryParams) => {
        if (throwsDbError) throw dbError;
        return dbRecords
      })
    }

    searchAPI = {
      execute: jest.fn(async (queryParams) => {
        if (throwsApiError) throw apiError;
        return apiRecords;
      })
    }

    logger = {
      error: jest.fn((msg, err) => { }),
      log: jest.fn()
    };

    return academyBenefitsSearch({
      buildSearchRecord,
      searchDb,
      searchAPI,
      logger
    });
  };

  it('calls the search DB function with given query params', async () => {
    const queryParams = { queryOne: 'query', name: 'name' };
    const gateway = createGateway({});

    await gateway.execute(queryParams);

    expect(searchDb.execute).toHaveBeenCalledWith(queryParams);
  });

  it('calls the search API function with given query params', async () => {
    const queryParams = { queryOne: 'query', name: 'name' };
    const gateway = createGateway({});

    await gateway.execute(queryParams);

    expect(searchAPI.execute).toHaveBeenCalledWith(queryParams);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const record = randomRecord1;
    const gateway = createGateway({ dbRecords: [record], throwsDbError: true });

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in Academy-Benefits: Error: Database error',
      dbError
    );
  });

  it('calls logger if the API throws an error but still returns records from DB', async () => {
    const record = randomRecord1;
    const gateway = createGateway({ dbRecords: [record], throwsApiError: true });

    const records = await gateway.execute({});

    expect(records.length).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in Academy-Benefits API: Error: API Error',
      apiError
    );
  });

  it('logs if the API and DB return the same records', async () => {
    const record = randomRecord1;
    const gateway = createGateway({ dbRecords: [record], apiRecords: [record] });

    await gateway.execute({});
    expect(logger.log).toHaveBeenCalledWith("Academy records retrieved from the API and the DB are identical");
  });

  it('logs if the API and DB return different numbers records', async () => {
    const dbRecords = [randomRecord1, randomRecord2];
    const apiRecords = [randomRecord1];
    const gateway = createGateway({ dbRecords: dbRecords, apiRecords: apiRecords });

    await gateway.execute({});

    expect(logger.log).toHaveBeenCalledWith("Academy API and DB have returned different records")
    expect(logger.log).toHaveBeenCalledWith({ "DB records": dbRecords })
    expect(logger.log).toHaveBeenCalledWith({ "API records": apiRecords })
  });

  it('logs if the API and DB return different records and returns the DB records', async () => {
    const dbRecord = randomRecord1;
    const apiRecord = randomRecordWithAllFields;
    const gateway = createGateway({ dbRecords: [dbRecord], apiRecords: [apiRecord] });

    const response = await gateway.execute({});

    expect(logger.log).toHaveBeenCalledWith("Academy API and DB have returned different records")
    expect(logger.log).toHaveBeenCalledWith({ "DB records": [dbRecord] })
    expect(logger.log).toHaveBeenCalledWith({ "API records": [apiRecord] })
    expect(response).toEqual([dbRecord])
  });
});
