const cominoFetchNotes = require('../../../lib/gateways/Comino/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('CominoFetchNotesGateway', () => {
  const claim_id = '123';
  const account_ref = '123';
  let buildNote;
  let db;
  const createGateway = (notes, throwsError) => {
    buildNote = jest.fn();

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return notes;
      })
    };

    return cominoFetchNotes({
      buildNote,
      db
    });
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

    const result = await gateway.execute({});

    expect(db.request).toHaveBeenCalledTimes(0);
    expect(result.length).toBe(0);
  });

  it('builds a single document', async () => {
    const record = { claim_id, NoteText: 'texty' };
    const gateway = createGateway([record]);

    await gateway.execute({ claim_id });

    const noteMatcher = expect.objectContaining({
      text: 'texty'
    });

    expect(buildNote).toHaveBeenCalledTimes(1);
    expect(buildNote).toHaveBeenCalledWith(noteMatcher);
  });

  it('returns an empty set of notes if there is an error', async () => {
    const record = { claim_id, NoteText: 123 };
    const gateway = createGateway([record], true);

    const records = await gateway.execute(claim_id);

    expect(buildNote).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
