const UHTContactsSearch = require('../../../lib/gateways/UHT-Contacts/Search');

describe('UHTContactsSearchGateway', () => {
  let buildSearchRecord;
  let db;
  let Logger;
  const dbError = new Error('Database error');

  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw dbError;
        }
        return records;
      })
    };

    Logger = {
      error: jest.fn((msg, err) => {})
    };

    return UHTContactsSearch({
      buildSearchRecord,
      db,
      Logger
    });
  };

  it('queries the database for forename if the query contains firstname', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/LIKE @forename/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: `%${firstName.toUpperCase()}%` })
    ]);

    await gateway.execute({ firstName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database for the forename if the query does not have a firstname', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/LIKE @forename/);

    await gateway.execute({});

    expect(db.request).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('queries the database for surname if the query contains surname', async () => {
    const gateway = createGateway([]);
    const lastName = 'smith';
    const queryMatcher = expect.stringMatching(/LIKE @surname/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: `%${lastName.toUpperCase()}%` })
    ]);

    await gateway.execute({ lastName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database for the surname if the query does not have a lastname', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/LIKE @surname/);

    await gateway.execute({});

    expect(db.request).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('returns record if all id components exist', async () => {
    const record = { house_ref: '123 ', person_no: 'd' };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '123/d' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
  });

  it("doesn't return a record if any of the id components are missing", async () => {
    const record = { house_ref: '123 ' };
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const record = { account_ref: '123', account_cd: '1' };
    const gateway = createGateway([record], true);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(Logger.error).toHaveBeenCalledWith(
      'Error searching customers in UHT-Contacts: Error: Database error',
      dbError
    );
  });
});
