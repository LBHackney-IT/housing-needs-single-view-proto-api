const cominoFetchDocuments = require('../../../lib/gateways/Comino/CominoFetchDocuments');

describe('CominoFetchDocumentsGateway', () => {
  let db;
  let buildDocument;
  const createGateway = (records, throwsError) => {
    buildDocument = jest.fn(({ id }) => {});

    db = {
      request: jest.fn(async claim_id => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    return cominoFetchDocuments({ db, buildDocument });
  };

  it('queries the database with the claim id and not account_ref if the query contains a claim id ', async () => {
    const gateway = createGateway([]);
    const claim_id = '123';
    const account_ref = '123';

    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({
        id: 'claim_id',
        value: `${claim_id}`
      })
    ]);

    const refParamMatcher = expect.arrayContaining([
      expect.not.objectContaining({
        id: 'account_ref'
      })
    ]);

    await gateway.execute({ claim_id, account_ref });

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(db.request).toHaveBeenCalledWith(expect.anything(), refParamMatcher);
    expect(db.request).toHaveBeenCalledTimes(1);
  });

  it('does not query the database with the claim id if the query does not contain a claim id', async () => {
    const gateway = createGateway([]);

    await gateway.execute({});

    expect(db.request).toHaveBeenCalledTimes(0);
  });

  it('queries the database with with the account_ref if query has account ref and does not have claim id', async () => {
    const gateway = createGateway([]);
    const account_ref = '123';

    const paramMatcher = expect.not.arrayContaining([
      expect.objectContaining({
        id: 'claim_id'
      })
    ]);

    const refParamMatcher = expect.arrayContaining([
      expect.objectContaining({
        id: 'account_ref'
      })
    ]);

    await gateway.execute({ account_ref });

    expect(db.request).toHaveBeenCalledWith(expect.anything(), refParamMatcher);
    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
  });

  it('builds a single document', async () => {
    const claim_id = '123';
    const record = { claim_id: '123', DocNo: '5' };
    const gateway = createGateway([record]);

    await gateway.execute({ claim_id });

    const recordMatcher = expect.objectContaining({
      id: '5'
    });
    expect(buildDocument).toHaveBeenCalledTimes(1);
    expect(buildDocument).toHaveBeenCalledWith(recordMatcher);
  });
});
