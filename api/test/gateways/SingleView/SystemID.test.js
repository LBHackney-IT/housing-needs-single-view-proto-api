const systemIDGateway = require('../../../lib/gateways/SingleView/SystemID');

describe('SystemIDGateway', () => {
  let db;
  const createGateway = (records, throwsError) => {
    db = {
      any: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    return systemIDGateway({
      db
    });
  };

  it('gets the systemID from singleview id', async () => {
    const gateway = createGateway([{ remote_id: '9918' }]);
    const name = 'JIGSAW';
    const id = '123';
    const paramMatcher = expect.arrayContaining([name, id]);

    const result = await gateway.execute(name, id);

    expect(db.any).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(result).toStrictEqual(['9918']);
  });

  it('gets multiple systemIDs from singleview id', async () => {
    const gateway = createGateway([
      { remote_id: '95503' },
      { remote_id: '9918' }
    ]);
    const name = 'JIGSAW';
    const id = '123';
    const paramMatcher = expect.arrayContaining([name, id]);

    const result = await gateway.execute(name, id);

    expect(db.any).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(result).toStrictEqual(['95503', '9918']);
  });

  it('returns underfined when no ids are found', async () => {
    const gateway = createGateway([]);

    const result = await gateway.execute('UHT', '821');
    expect(result).toStrictEqual(undefined);
  });
});
