const academyCouncilTaxFetchNotes = require('../../../lib/gateways/Academy-CouncilTax/FetchNotes');

describe('AcademyCouncilTaxFetchNotesGateway', () => {
  let cominoFetchNotesGateway;
  let getSystemId;

  const createGateway = (records, throwsError, existsInSystem) => {
    cominoFetchNotesGateway = {
      execute: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return academyCouncilTaxFetchNotes({
      cominoFetchNotesGateway,
      getSystemId
    });
  };

  it('if customer has a system id we get the notes', async () => {
    const gateway = createGateway([], false, true);
    const id = '123';

    const cominoParamMatcher = expect.objectContaining({ account_ref: '123' });

    await gateway.execute(id);

    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('queries the database with the account reference if the query contains an account reference', async () => {
    const gateway = createGateway([], false, true);
    const id = '123';

    const cominoParamMatcher = expect.objectContaining({ account_ref: '123' });

    await gateway.execute(id);

    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('if customer does not have a system id we do not get the notes', async () => {
    const gateway = createGateway([], false, false);
    const id = '123';
    const result = await gateway.execute(id);

    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledTimes(0);
    expect(result.length).toBe(0);
  });

  it('returns an empty set of notes if there is an error', async () => {
    const id = '123';
    const record = { account_ref: '123' };
    const gateway = createGateway([record], true);

    const notes = await gateway.execute(id);

    expect(notes.length).toBe(0);
  });
});
