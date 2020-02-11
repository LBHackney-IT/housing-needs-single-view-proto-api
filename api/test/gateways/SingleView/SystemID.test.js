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
    const gateway = createGateway([]);
    const name = 'JIGSAW';
    const id = '123';
    const paramMatcher = expect.arrayContaining([name, id]);

    await gateway.execute(name, id);

    expect(db.any).toHaveBeenCalledWith(expect.anything(), paramMatcher);
  });
});
