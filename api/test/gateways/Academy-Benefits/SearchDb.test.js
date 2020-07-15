const academyBenefitsSearchDb = require('../../../lib/gateways/Academy-Benefits/SearchDb');

describe('AcademyBenefitsSearchGateway', () => {
  let db;
  let buildSearchRecord;

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

    return academyBenefitsSearchDb({
      db,
      buildSearchRecord
    });
  };

  it('queries the database for forename if the query contains firstname', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/forename LIKE @forename/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: `%${firstName.toUpperCase()}%` })
    ]);

    await gateway.searchDb({ firstName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database for the forename if the query does not have a firstname', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/forename LIKE @forename/);

    await gateway.searchDb({});

    expect(db.request).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('queries the database for lastname if the query contains lastname', async () => {
    const gateway = createGateway([]);
    const lastName = 'smith';
    queryMatcher = expect.stringMatching(/surname LIKE/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: `%${lastName.toUpperCase()}%` })
    ]);

    await gateway.searchDb({ lastName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database for the lastname if the query does not have a lastname', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.not.stringMatching(/surname LIKE @surname/);

    await gateway.searchDb({});

    expect(db.request).toHaveBeenCalledWith(queryMatcher, expect.anything());
  });

  it('returns record if all id components exist', async () => {
    const record = { claim_id: '123', check_digit: 'd', person_ref: '1' };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '123d/1' });

    const records = await gateway.searchDb({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
    expect(records.length).toBe(1);
  });

  it("doesn't return a record if any of the id components are missing", async () => {
    const record = { claim_id: '123', check_digit: 'd' };
    const gateway = createGateway([record]);

    const records = await gateway.searchDb({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });


  it('returns records from the database', async () => {
    const record = { claim_id: '123', check_digit: 'd', person_ref: '1' };
    const gateway = createGateway([record]);

    const response = await gateway.searchDb({});

    expect(response).toEqual([{id: '123d/1'}])
  });
});
