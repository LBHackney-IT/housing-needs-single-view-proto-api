const CreateRecord = require('../../../lib/gateways/SingleView/CreateRecord');

describe('CreateRecord', () => {
  let db;

  let none = jest.fn(x => {
    return 'hello';
  });

  let task = jest.fn(x => {
    return {
      none: jest.fn(async () => {
        return x;
      })
    };
  });
  const createGateway = (records, throwsError) => {
    db = {
      one: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      }),
      task,
      none: jest.fn(async () => {
        return records;
      })
    };

    return CreateRecord({
      db
    });
  };

  it('creates a cutomer in SV database', async () => {
    const gateway = createGateway();

    await gateway.execute();

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

    // expect(result).toEqual(record);
    expect(task.none).toHaveBeenCalledWith('this');
  });

  it('Cathes an error if it is thrown', async () => {
    const gateway = createGateway({ id: 1 }, true);

    expect(await gateway.execute()).toBeUndefined();
  });
});
