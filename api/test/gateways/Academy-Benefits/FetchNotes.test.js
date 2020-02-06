const academyBenefitsFetchNotes = require('../../../lib/gateways/Academy-Benefits/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('AcademyBenefitsFetchNotesGateway', () => {
  let buildNote;
  let db;
  let cominoFetchNotesGateway;
  let getSystemId;

  const records = [
    {
      text_value: `User Id: abc  Date: 31.01.2020 14:10:08  12345
    some text1  
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    User Id: abc  Date: 10.04.2019 14:50:50  12345
    some text2
    ----------------------------------`
    },
    {
      text_value: `----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    User Id: id  Date: 07.02.2019 10:32:33  1357
    some text3
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    User Id: idtoo  Date: 15.01.2019 16:12:12  4536
    some text4
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    User Id: theid  Date: 16.08.2018 15:30:07  1111
    some text`
    },
    {
      text_value: `5
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`
    }
  ];

  const createGateway = (notes, existsInSystem, throwsError) => {
    buildNote = jest.fn();

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
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
    const gateway = createGateway([], false, false);
    const id = '123/1';
    const results = await gateway.execute(id);

    expect(db.request).toHaveBeenCalledTimes(0);
    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledTimes(0);
    expect(results.length).toBe(0);
  });

  it('builds 5 notes', async () => {
    const id = '123';
    const gateway = createGateway([], true, false);

    await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'some text5',
      system: 'ACADEMY-Benefits',
      user: 'theid',
      id: null
    });

    const dashMatcher = expect.objectContaining(expect.stringMatching(/-{50}/));

    expect(buildNote).toHaveBeenCalledTimes(5);
    expect(buildNote).toHaveBeenCalledWith(recordMatcher);
    expect(buildNote).not.toHaveBeenCalledWith(dashMatcher);
  });

  it('returns an empty set of notes if there is an error', async () => {
    const id = '123';
    const gateway = createGateway([], true, true);

    const records = await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
