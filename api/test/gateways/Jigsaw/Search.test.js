const jigsawSearch = require('../../../lib/gateways/Jigsaw/Search');

describe('JigsawSearchGateway', () => {
  let buildSearchRecord;
  let doJigsawGetRequest;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    doJigsawGetRequest = jest.fn(async () => {
      if (throwsError) {
        throw dbError;
      }
      return records;
    });

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return jigsawSearch({
      buildSearchRecord,
      doJigsawGetRequest,
      logger
    });
  };

  it('calls doJigsawGetRequest gets with firstname and correct `url', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/maria/);
    const searchUrl = expect.stringMatching(
      new RegExp(process.env.JigsawCustomerBaseSearchUrl)
    );

    await gateway.execute({ firstName });

    expect(doJigsawGetRequest).toHaveBeenCalledWith(searchUrl, {
      search: queryMatcher
    });
  });

  it('queries the database for lastname if the query contains lastname', async () => {
    const gateway = createGateway([]);
    const lastName = 'smith';
    const queryMatcher = expect.stringMatching(/smith/);

    await gateway.execute({ lastName });

    expect(doJigsawGetRequest).toHaveBeenCalledWith(expect.anything(), {
      search: queryMatcher
    });
  });
  it('queries the database for firstname and lastname if the query contains firstname and lastname', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const lastName = 'smith';
    const queryMatcher = expect.stringMatching(/maria smith/);

    await gateway.execute({ firstName, lastName });

    expect(doJigsawGetRequest).toHaveBeenCalledWith(expect.anything(), {
      search: queryMatcher
    });
  });

  it('returns record if id exists', async () => {
    const record = { id: 123 };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '123' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
  });

  it('does not return record if id is missing', async () => {
    const record = {};
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const record = { id: 123 };
    const gateway = createGateway([record], true);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in Jigsaw: Error: Database error',
      dbError
    );
  });

  it('filters out invalid records', async () => {
    const record = { id: 0 };
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
  });
});
