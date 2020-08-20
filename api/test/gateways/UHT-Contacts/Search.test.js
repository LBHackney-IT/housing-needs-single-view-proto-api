const UHTContactsSearch = require('../../../lib/gateways/UHT-Contacts/Search');

describe('UHTContactsSearchGateway', () => {
  let buildSearchRecord;
  let logger;
  let searchDb;
  let searchApi;
  const dbError = new Error('Database error');
  const apiError = new Error('Api Error');
  const randomRecord1 = {
      id: '1244/3',
      firstName: 'Jimmy',
      lastName: 'Jones',
      dob: '22/08/2013',
      nino: 'JE97254728D',
      address: '1234 the road, London, Hackney',
      postcode: 'LG7 4GH',
      source: 'UHT-Contacts', 
      links: {
        uhContact: '12345' 
      }
  };
  const randomRecord2 = {
      id: '1354/1',
      firstName: 'Sarah',
      lastName: 'Jane',
      dob: '14/02/1953',
      nino: 'CS46287Y',
      address: '1 down the lane, Hackney',
      postcode: 'HG4 3TH',
      source: 'UHT-Contacts', 
      links: {
        uhContact: '8217648' 
      }
  };

  const createGateway = ({dbRecords = [], throwsDbError = false, apiRecords = [], throwsApiError = false}) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });
    searchDb = {
      execute: jest.fn((query) => {
        if (throwsDbError) {
          throw dbError;
        }
        return dbRecords;
      }
    )};
    searchApi = {
      execute: jest.fn((query) => {
        if (throwsApiError) {
          throw apiError;
        }
        return apiRecords;
      })
    }

    logger = {
      error: jest.fn((msg, err) => {}),
      log: jest.fn()
    };

    return UHTContactsSearch({
      buildSearchRecord,
      searchDb,
      searchApi,
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

    expect(searchApi.execute).toHaveBeenCalledWith(queryParams);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const record = { account_ref: '123', account_cd: '1' };
    const gateway = createGateway({ dbRecords: [record], throwsDbError:  true});

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in UHT-Contacts: Error: Database error',
      dbError
    );
  });

  it('logs if the API and DB return the same records', async () => {
    const dbRecord = {... randomRecord1};
    const apiRecord = {...randomRecord1};
    const gateway = createGateway({ dbRecords: [dbRecord], apiRecords: [apiRecord] });

    await gateway.execute({});
    expect(logger.log).toHaveBeenCalledWith("UHT Contact records retrieved from the API and the DB are identical");
  });

  it('logs if the API and DB return different numbers records', async () => {
    const dbRecords = [{...randomRecord1}, {...randomRecord2}];
    const apiRecords = [{...randomRecord1}];
    const gateway = createGateway({ dbRecords: dbRecords, apiRecords: apiRecords });

    await gateway.execute({});

    expect(logger.log).toHaveBeenCalledWith("Housing API and UH DB have returned different records")
    expect(logger.log).toHaveBeenCalledWith({ "DB records": dbRecords })
    expect(logger.log).toHaveBeenCalledWith({ "API records": apiRecords })
  });

  it('logs if the API and DB return different records and returns the DB records', async () => {
    const dbRecord = {...randomRecord1};
    const apiRecord = {...randomRecord2};
    const gateway = createGateway({ dbRecords: [dbRecord], apiRecords: [apiRecord] });

    const response = await gateway.execute({});

    expect(logger.log).toHaveBeenCalledWith("Housing API and UH DB have returned different records")
    expect(logger.log).toHaveBeenCalledWith({ "DB records": [dbRecord] })
    expect(logger.log).toHaveBeenCalledWith({ "API records": [apiRecord] })
    expect(response).toEqual([dbRecord])
  });
});
