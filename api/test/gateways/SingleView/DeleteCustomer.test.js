const DeleteCustomer = require('../../../lib/gateways/SingleView/DeleteCustomer');

describe('DeleteCustomer', () => {
  let db;
  let Logger;
  const dbError = new Error('Database error');

  const createGateway = (records, throwsError) => {
    db = {
      none: jest.fn(async () => {
        if (throwsError) {
          throw dbError;
        }
        return records;
      })
    };

    Logger = {
      error: jest.fn( (msg, err) => {})
    };

    return DeleteCustomer({
      db,
      Logger
    });
  };

  it('removes Customer Links', async () => {
    const gateway = createGateway([]);

    await gateway.execute(1);

    expect(
      db.none
    ).toHaveBeenCalledWith(
      'DELETE FROM customer_links WHERE customer_id = ${id}',
      { id: 1 }
    );
  });

  it('removes Customer', async () => {
    const gateway = createGateway([]);

    await gateway.execute(1);

    expect(
      db.none
    ).toHaveBeenCalledWith('DELETE FROM customers WHERE id = ${id}', { id: 1 });
  });

  it('Catches an error if it is thrown and calls logger', async () => {
    const gateway = createGateway({ id: 1 }, true);

    expect(await gateway.execute()).toBeUndefined();
    expect(Logger.error).toHaveBeenCalledWith(
      'Could not add a disconnect customer because of an error: Error: Database error',
      dbError
    );
  });
});
