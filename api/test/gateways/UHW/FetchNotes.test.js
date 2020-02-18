const uhwFetchNotes = require('../../../lib/gateways/UHW/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('UHWFetchNotesGateway', () => {
  const id = '123/1';
  const queryMatcher = expect.stringMatching(/KeyNumb = @id/);
  const paramMatcher = expect.arrayContaining([
    expect.objectContaining({ id: 'id', value: '123/1' })
  ]);

  let buildNote;
  let getSystemId;
  let db;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildNote = jest.fn();

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    db = {
      request: jest.fn(async (name, id) => {
        if (throwsError) {
          throw new Error('error');
        }
        return records;
      })
    };

    return uhwFetchNotes({
      buildNote,
      getSystemId,
      db
    });
  };

  it('gets the system ID', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(Systems.UHW, id);
  });

  it('queries the database with id if the systemId exists', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('does not query the database with id if the systemId does not exist', async () => {
    const gateway = createGateway([], false);

    await gateway.execute(id);
    expect(db.request).not.toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('can build one note', async () => {
    const record = { NoteText: 'details', UserID: 'user1' };
    const gateway = createGateway([record], true);

    await gateway.execute(id);

    const paramMatcher = expect.objectContaining({
      text: 'details',
      user: 'user1',
      title: 'Note',
      system: Systems.UHW
    });

    expect(buildNote).toHaveBeenCalledTimes(1);
    expect(buildNote).toHaveBeenCalledWith(paramMatcher);
  });

  it('returns an empty set of notes if there is an error', async () => {
    const gateway = createGateway([{}], true, true);

    const records = await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});