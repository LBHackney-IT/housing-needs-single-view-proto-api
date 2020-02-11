const academyBenefitsFetchNotes = require('../../../lib/gateways/Academy-Benefits/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('AcademyBenefitsFetchNotesGateway', () => {
  const id = '123/1';
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

    cominoFetchNotesGateway = { execute: jest.fn() };

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

  it('gets the notes if customer has a system id', async () => {
    const gateway = createGateway([], true);
    const academyParamMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    const cominoParamMatcher = expect.objectContaining({ claim_id: '123' });

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(
      Systems.ACADEMY_BENEFITS,
      id
    );
    expect(db.request).toHaveBeenCalledWith(
      expect.anything(),
      academyParamMatcher
    );
    expect(cominoFetchNotesGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('does not get the notes if customer does not have a system id', async () => {
    const gateway = createGateway([]);

    const results = await gateway.execute(id);

    expect(db.request).not.toHaveBeenCalled;
    expect(cominoFetchNotesGateway.execute).not.toHaveBeenCalled();
    expect(results.length).toBe(0);
  });

  it('builds 5 notes with correct text', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    for (let i = 1; i <= 5; i++) {
      expect(buildNote).toHaveBeenCalledWith(
        expect.objectContaining({ text: `some text${i}` })
      );
    }
  });

  it('builds 5 notes with correct date', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    const dates = [
      new Date('2020-01-31T14:10:08.000Z'),
      new Date('2019-04-10T14:50:50.000Z'),
      new Date('2019-02-07T10:32:33.000Z'),
      new Date('2019-01-15T16:12:12.000Z'),
      new Date('2018-08-16T15:30:07.000Z')
    ];

    for (let i = 0; i <= 4; i++) {
      expect(buildNote).toHaveBeenNthCalledWith(
        i + 1,
        expect.objectContaining({ date: dates[i] })
      );
    }
  });

  it('returns an empty set of notes if there is an error', async () => {
    const gateway = createGateway([], true, true);

    const records = await gateway.execute(id);

    expect(buildNote).not.toHaveBeenCalled();
    expect(records.length).toBe(0);
  });
});
