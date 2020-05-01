const CreateRecord = require('../../../lib/gateways/SingleView/CreateRecord');

class MyDB {
  task(cb) {
    cb(this);
  }
}

describe('CreateRecord', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  let db;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (records, throwsError) => {
    db = new MyDB();
    db.none = jest.fn();
    db.one = jest.fn(async () => {
      if (throwsError) {
        throw dbError;
      }
      return records;
    });

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return CreateRecord({
      db,
      logger
    });
  };

  it('creates a customer in SV database', async () => {
    const records = [{ firstName: 'Laura', lastName: 'K' }];
    const gateway = createGateway(records);

    await gateway.execute(records);

    expect(db.one).toHaveBeenCalledWith(
      'INSERT INTO customers\nDEFAULT VALUES\nRETURNING id;\n'
    );
  });

  it('returns a customer link', async () => {
    const records = [
      {
        id: '123',
        firstName: 'Laura',
        lastName: 'K',
        source: 'JIGSAW',
        address: 'place',
        dob: '10/01/1992',
        nino: '1234567'
      }
    ];
    const gateway = createGateway(records);
    await gateway.execute(records);

    expect(db.none).toHaveBeenCalled();
  });

  it('Catches an error if it is thrown and calls the logger', async () => {
    const gateway = createGateway({ id: 1 }, true);

    expect(await gateway.execute()).toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith(
      'Could not add a customer because of an error: Error: Database error',
      dbError
    );
  });
});
