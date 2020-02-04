const systemIDGateway = require('../../../lib/gateways/SingleView/SystemID');

describe('SystemIDGateway', () => {
  let db;
  const createGateway = (records, throwsError) => {
    db = {
      oneOrNone: jest.fn(async () => {
        if (throwsError) {
          return new Error('Database error');
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

    expect(db.oneOrNone).toHaveBeenCalledWith(expect.anything(), paramMatcher);
  });
});
