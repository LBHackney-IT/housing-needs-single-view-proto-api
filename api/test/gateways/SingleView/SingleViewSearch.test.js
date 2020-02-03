const singleViewSearch = require('@lib/gateways/SingleView/SingleViewSearch');
let db;
let buildSearchRecord;

describe('SingleViewSearchGateway', () => {
  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    db = {
      any: jest.fn(async () => {
        if (throwsError) {
          return new Error('Database error');
        }
        return records;
      })
    };

    return singleViewSearch({
      buildSearchRecord,
      db
    });
  };

  it('if the query contains firstname then the db is queried for firstname', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/first_name ILIKE/);
    const paramMatcher = expect.objectContaining({ firstName: '%maria%' });

    await gateway.execute({ firstName });

    expect(db.any).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('if the query does not have a firstname then the db is not queried for the forename', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/first_name ILIKE/);

    await gateway.execute({});

    expect(db.any).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('if the query contains lastname then the db is queried for lastname', async () => {
    const gateway = createGateway([]);
    const lastName = 'Smith';
    const queryMatcher = expect.stringMatching(/last_name ILIKE/);
    const paramMatcher = expect.objectContaining({ lastName: '%Smith%' });

    await gateway.execute({ lastName });

    expect(db.any).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('if the query does not have a lastname then the db is not queried for the lastname', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/last_name ILIKE/);

    await gateway.execute({});

    expect(db.any).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('returns a record', async () => {
    const record = { customer_id: '123' };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '123' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty set of records if there is an error', async () => {
    const record = { customer_id: '123' };
    const gateway = createGateway([record], true);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
  });
});
