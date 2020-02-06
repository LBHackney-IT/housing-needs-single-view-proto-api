const academyBenefitsFetchNotes = require('../../../lib/gateways/Academy-Benefits/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('AcademyBenefitsFetchNotesGateway', () => {
  let buildNote;
  let db;
  let cominoFetchNotesGateway;
  let getSystemId;

  const createGateway = (notes, existsInSystem, throwsError) => {
    buildNote = jest.fn();

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return [{ text_value: notes }];
      })
    };

    cominoFetchNotesGateway = {
      execute: jest.fn(async () => {
        return [];
      })
    };

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return academyBenefitsFetchNotes({
      buildNote,
      db,
      cominoFetchNotesGateway,
      getSystemId
    });
  };

  it('gets the system ID', async () => {
    const gateway = createGateway([], true);
    id = '123';

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(
      Systems.ACADEMY_BENEFITS,
      '123'
    );
  });

  it('if customer has a system id we get the notes', async () => {
    const gateway = createGateway([], true, false);
    const id = '123/1';
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    const cominoParamMatcher = expect.objectContaining({ claim_id: '123' });

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('if customer does not have a system id we do not get the notes', async () => {
    const gateway = createGateway('one', false, false);
    const id = '123/1';
    const results = await gateway.execute(id);

    expect(db.request).toHaveBeenCalledTimes(0);
    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledTimes(0);
    expect(results.length).toBe(0);
  });

  it('builds a note', async () => {
    const id = '123';

    const record = 'User Id: abc  Date: 31.01.2013 14:11:08  949327359\ntext';
    const gateway = createGateway(record, true, false);

    await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'text'
    });
    expect(buildNote).toHaveBeenCalledTimes(1);
    expect(buildNote).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty set of notes if there is an error', async () => {
    const id = '123';
    const record = { id: '123' };
    const gateway = createGateway([record], true, true);

    const records = await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
