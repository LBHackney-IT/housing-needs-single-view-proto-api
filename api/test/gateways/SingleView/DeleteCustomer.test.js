const DeleteCustomer = require('../../../lib/gateways/SingleView/DeleteCustomer');

describe('DeleteCustomer', () => {
  let db;
  const createGateway = (records, throwsError) => {
    db = {
      none: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    return DeleteCustomer({
      db
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

  it('Cathes an error if it is thrown', async () => {
    const gateway = createGateway({ id: 1 }, true);

    expect(await gateway.execute()).toBeUndefined();
  });
});
