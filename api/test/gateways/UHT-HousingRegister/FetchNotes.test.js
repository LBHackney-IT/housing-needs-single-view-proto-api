const uhtHousingRegisterFetchNotes = require('../../../lib/gateways/UHT-HousingRegister/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('UHTHousingFetchNotesGateway', () => {
  const id = '123/1';
  let buildNote;
  let getSystemId;
  let db;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildNote = jest.fn();

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        return id;
      })
    };

    db = {
      request: jest.fn(async (name, id) => {
        return records;
      })
    };

    return uhtHousingRegisterFetchNotes({
      buildNote,
      getSystemId,
      db
    });
  };

  it('gets the system ID', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(
      Systems.UHT_HOUSING_REGISTER,
      id
    );
  });

  it('queries the database for app_ref and person_no if the app_ref adn person_no exist in systemId', async () => {
    const gateway = createGateway([]);
    const queryMatcher = expect.stringMatching(/app_ref = @app_ref/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ id: 'app_ref', value: '123' })
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });
});
