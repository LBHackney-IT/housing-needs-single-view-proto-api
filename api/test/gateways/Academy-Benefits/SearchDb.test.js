const academyBenefitsSearchDb = require('../../../lib/gateways/Academy-Benefits/SearchDb');

describe('AcademyBenefitsSearchGateway', () => {
  let db;

  const createGateway = (records, throwsError) => {
    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw dbError;
        }
        return records;
      })
    };

    return academyBenefitsSearchDb({
      db
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

  it('returns records from the database', async () => {
    const record = { claim_id: '123', check_digit: 'd', person_ref: '1' };
    const gateway = createGateway([record]);

    const response = await gateway.searchDb({});

    expect(response).toEqual([record])
  });
});
