const singleViewSearch = require('../../../lib/gateways/SingleView/Search');
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
          throw new Error('Database error');
        }
        return records;
      })
    };

    return singleViewSearch({
      buildSearchRecord,
      db
    });
  };

  it('queries the database for firstname if the query contains firstname', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/first_name ILIKE/);
    const paramMatcher = expect.objectContaining({ firstName: '%maria%' });

    await gateway.execute({ firstName });

    expect(db.any).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database with the forename if the query does not have a firstname', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/first_name ILIKE/);

    await gateway.execute({});

    expect(db.any).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('queries the database for lastname if the query contains lastname', async () => {
    const gateway = createGateway([]);
    const lastName = 'Smith';
    const queryMatcher = expect.stringMatching(/last_name ILIKE/);
    const paramMatcher = expect.objectContaining({ lastName: '%Smith%' });

    await gateway.execute({ lastName });

    expect(db.any).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database for the lastname if the query does not have a lastname', async () => {
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
