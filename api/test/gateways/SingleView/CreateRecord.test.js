const CreateRecord = require('../../../lib/gateways/SingleView/CreateRecord');
jest.mock('pg-promise');

describe('CreateRecord', () => {
  let db;
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  let none = jest.fn(x => {
    return 'hello';
  });
  const createGateway = (records, throwsError) => {
    db = {
      one: jest.fn(async () => {
        return records;
      }),
      task: jest.fn(async t =>
        jest.fn(x => {
          console.log('thisis');
        })
      ),
      none: jest.fn(async () => {
        return records;
      })
    };

    return CreateRecord({
      db
    });
  };

  it('creates a cutomer in SV database', async () => {
    const record = [{ firstName: 'Laura', lastName: 'K' }];
    const gateway = createGateway();

    await gateway.execute(record);

    expect(db.one).toHaveBeenCalledWith(
      'INSERT INTO customers\nDEFAULT VALUES\nRETURNING id;\n'
    );
  });

  it('returns a customer link', async () => {
    const record = [
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
    const gateway = createGateway();
    const result = await gateway.execute(record);

    expect(none).toHaveBeenCalledWith('this');
  });
});
