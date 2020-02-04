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

  const claimIdMatcher = id => {
    return expect.arrayContaining([
      expect.objectContaining({
        id: 'claim_id',
        value: `${id}`
      })
    ]);
  };

  const accountRefMatcher = id => {
    return expect.arrayContaining([
      expect.objectContaining({
        id: 'account_ref',
        value: `${id}`
      })
    ]);
  };

  it('queries the database with the claim id and not account_ref if the query contains a claim id ', async () => {
    const gateway = createGateway([]);
    const claim_id = '123';
    const account_ref = '123';

    await gateway.execute({ claim_id, account_ref });

    expect(db.request).toHaveBeenCalledWith(
      expect.anything(),
      claimIdMatcher(claim_id)
    );
    expect(db.request).not.toHaveBeenCalledWith(
      expect.anything(),
      accountRefMatcher(account_ref)
    );
    expect(db.request).toHaveBeenCalledTimes(1);
  });

  it('queries the database with with the account_ref if query has account ref and does not have claim id', async () => {
    const gateway = createGateway([]);
    const claim_id = '123';
    const account_ref = '123';

    await gateway.execute({ account_ref });

    expect(db.request).toHaveBeenCalledWith(
      expect.anything(),
      accountRefMatcher(account_ref)
    );
    expect(db.request).not.toHaveBeenCalledWith(
      expect.anything(),
      claimIdMatcher(claim_id)
    );
  });

  it('does not query the database if query contains no id', async () => {
    const gateway = createGateway([]);

    await gateway.execute({});

    expect(db.request).toHaveBeenCalledTimes(0);
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

  it('returns an empty set of documents if there is an error', async () => {
    const id = '123';
    const record = { id: '123' };
    const gateway = createGateway([record], true, true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
