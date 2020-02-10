const jigsawSearch = require('../../../lib/gateways/Jigsaw/Search');

describe('JigsawSearchGateway', () => {
  let buildSearchRecord;
  let doJigsawGetRequest;

  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    doJigsawGetRequest = jest.fn(async () => {
      if (throwsError) {
        throw new Error('Database error');
      }
      return records;
    });

    return jigsawSearch({
      buildSearchRecord,
      doJigsawGetRequest
    });
  };

  it('calls doJigsawGetRequest gets with firstname and correct `url', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/maria/);
    const searchUrl = expect.stringMatching(
      /zebracustomersproduction.azurewebsites.net/
    );
    await gateway.execute({ firstName });

    expect(doJigsawGetRequest).toHaveBeenCalledWith(searchUrl, {
      search: queryMatcher
    });
  });

  it('if the query contains lastname then the db is queried for lastname', async () => {
    const gateway = createGateway([]);
    const lastName = 'smith';
    const queryMatcher = expect.stringMatching(/smith/);

    await gateway.execute({ lastName });

    expect(doJigsawGetRequest).toHaveBeenCalledWith(expect.anything(), {
      search: queryMatcher
    });
  });
  it('if the query contains firstname andlastname then the db is queried for firstname and lastname', async () => {
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

  it('Does not return record if id is missing', async () => {
    const record = {};
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns an empty set of records if there is an error', async () => {
    const record = { id: 123 };
    const gateway = createGateway([record], true);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
  });

  it('filters out invalid records', async () => {
    const record = { id: 0 };
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
  });
});
