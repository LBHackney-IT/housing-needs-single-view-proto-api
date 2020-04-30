const academyCouncilTaxFetchNotes = require('../../../lib/gateways/Academy-CouncilTax/FetchNotes');

describe('AcademyCouncilTaxFetchNotesGateway', () => {
  const id = '123';

  let cominoFetchNotesGateway;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (records, throwsError, existsInSystem) => {
    cominoFetchNotesGateway = {
      execute: jest.fn(async () => {
        if (throwsError) {
          throw dbError;
        }
        return records;
      })
    };

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return academyCouncilTaxFetchNotes({
      cominoFetchNotesGateway,
      logger
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

  it('returns an empty set of notes if there is an error and logger is called', async () => {
    const record = { account_ref: '123' };
    const gateway = createGateway([record], true);

    const notes = await gateway.execute(id);

    expect(notes.length).toBe(0);

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching customer notes in Comino: Error: Database error',
      dbError
    );
  });
});
