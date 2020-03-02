const academyCouncilTaxFetchNotes = require('../../../lib/gateways/Academy-CouncilTax/FetchNotes');

describe('AcademyCouncilTaxFetchNotesGateway', () => {
  const id = '123';

  let cominoFetchNotesGateway;
  const createGateway = (records, throwsError, existsInSystem) => {
    cominoFetchNotesGateway = {
      execute: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    return academyCouncilTaxFetchNotes({
      cominoFetchNotesGateway
    });
  };

  it('gets the notes if customer has a system id', async () => {
    const gateway = createGateway([], false, true);

    const cominoParamMatcher = expect.objectContaining({ account_ref: '123' });

    await gateway.execute(id);

    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('queries the database with the account reference if the query contains an account reference', async () => {
    const gateway = createGateway([], false, true);

    const cominoParamMatcher = expect.objectContaining({ account_ref: '123' });

    await gateway.execute(id);

    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('does not get the notes if customer does not have a system id', async () => {
    const gateway = createGateway([]);
    const result = await gateway.execute(null);

    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledTimes(0);
    expect(result.length).toBe(0);
  });

  it('returns an empty set of notes if there is an error', async () => {
    const record = { account_ref: '123' };
    const gateway = createGateway([record], true);

    const notes = await gateway.execute(id);

    expect(notes.length).toBe(0);
  });
});
