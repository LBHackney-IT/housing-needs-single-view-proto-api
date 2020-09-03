const UHTTenantsFetchRecord = require('../../../lib/gateways/UHT-Tenancies/FetchTenants');

describe('UHTTenantsFetchRecord gateway', () => {
  let db;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (response, throwsError) => {
    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return response;
      })
    };

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return UHTTenantsFetchRecord({
      db,
      logger
    });
  };

  it('queries the database with appropriate id', async () => {
    const gateway = createGateway([]);
    const id = '123456/1';
    const tag_refQueryMatcher = expect.stringMatching(/tag_ref = @tag_ref/);

    const paramMatcher = expect.arrayContaining([
      {
        id: 'tag_ref',
        type: 'NVarChar',
        value: id
      }
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(tag_refQueryMatcher, paramMatcher);
  });

  it('catches and calls logger', async () => {
    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching tenants in UHT-Tenancies/FetchTenants: Error: Database error',
      dbError
    );
  });
});
