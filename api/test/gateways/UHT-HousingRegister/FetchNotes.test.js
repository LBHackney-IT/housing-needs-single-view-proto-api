const uhtHousingRegisterFetchNotes = require('../../../lib/gateways/UHT-HousingRegister/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('UHTHousingFetchNotesGateway', () => {
  const id = '123/1';
  const appRefQueryMatcher = expect.stringMatching(/app_ref = @app_ref/);
  const appRefParamMatcher = expect.arrayContaining([
    expect.objectContaining({ id: 'app_ref', value: '123' })
  ]);

  const personQueryMatcher = expect.stringMatching(/app_ref = @app_ref/);
  const personParamMatcher = expect.arrayContaining([
    expect.objectContaining({ id: 'person_no', value: '1' })
  ]);

  let buildNote;
  let db;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (records, existsInSystem, throwsError) => {
    buildNote = jest.fn();

    db = {
      request: jest.fn(async (name, id) => {
        if (throwsError) {
          throw dbError;
        }
        return records;
      })
    };

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return uhtHousingRegisterFetchNotes({
      buildNote,
      db,
      logger
    });
  };

  it('queries the database for app_ref and person_no if the app_ref and person_no exist in systemId', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(
      appRefQueryMatcher,
      appRefParamMatcher
    );
    expect(db.request).toHaveBeenCalledWith(
      personQueryMatcher,
      personParamMatcher
    );
  });

  it('does not query the database for app_ref and person_no if the app_ref and person_no do not exist', async () => {
    const gateway = createGateway([], false);

    await gateway.execute(null);

    expect(db.request).not.toHaveBeenCalledWith(
      appRefQueryMatcher,
      appRefParamMatcher
    );
    expect(db.request).not.toHaveBeenCalledWith(
      personQueryMatcher,
      personParamMatcher
    );
  });

  it('can build one note', async () => {
    const record = { clog_details: 'details', username: 'user1' };
    const gateway = createGateway([record], true);

    await gateway.execute(id);

    const paramMatcher = expect.objectContaining({
      text: 'details',
      user: 'user1',
      title: 'Note',
      system: Systems.UHT_HOUSING_REGISTER
    });

    expect(buildNote).toHaveBeenCalledTimes(1);
    expect(buildNote).toHaveBeenCalledWith(paramMatcher);
  });

  it('returns an empty set of notes if there is an error and calls logger', async () => {
    const gateway = createGateway([{}], true, true);

    const records = await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching customer notes in UHT-HousingRegister: Error: Database error',
      dbError
    );
  });
});
