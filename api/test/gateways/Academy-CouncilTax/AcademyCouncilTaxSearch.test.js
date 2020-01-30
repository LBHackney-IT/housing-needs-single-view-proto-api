const academyCouncilTaxSearch = require('../../../lib/gateways/Academy-CouncilTax/AcademyCouncilTaxSearch');

describe('AcademyCouncilTaxSearchGateway', () => {
  let buildSearchRecord;
  let db;

  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          return new Error('Database error');
        }
        return records;
      })
    };

    return academyCouncilTaxSearch({
      buildSearchRecord,
      db
    });
  };

  it('if the query contains firstname then the db is queried for full name', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/LIKE @full_name/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: firstName.toUpperCase() })
    ]);

    await gateway.execute({ firstName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('if the query contains firstname and lastname then the db is queried for full name', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const lastName = 'dawg';
    const queryMatcher = expect.stringMatching(/LIKE @full_name/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({
        value: `${lastName.toUpperCase()}%${firstName.toUpperCase()}`
      })
    ]);

    await gateway.execute({ firstName, lastName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('if the query contains lastname then the db is queried for full name', async () => {
    const gateway = createGateway([]);
    const lastName = 'dawg';
    const queryMatcher = expect.stringMatching(/LIKE @full_name/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: lastName.toUpperCase() })
    ]);

    await gateway.execute({ lastName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('returns record if all id components exist', async () => {
    const record = { account_ref: '123', account_cd: '1' };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '1231' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
  });

  it('Does not return record if part of id is missing', async () => {
    const record = { account_ref: '123' };
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns an empty set of records if there is an error', async () => {
    const record = { account_ref: '123', account_cd: '1' };
    const gateway = createGateway([record], true);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
  });
});
