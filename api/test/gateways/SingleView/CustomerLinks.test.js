const CustomerLinks = require('../../../lib/gateways/SingleView/CustomerLinks');

describe('CustomerLinks', () => {
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

    return CustomerLinks({
      db
    });
  };

  it('gets the customer links from singleview id', async () => {
    const gateway = createGateway([]);
    const name = 'JIGSAW';
    const paramMatcher = expect.arrayContaining([name]);

    await gateway.execute(name);

    expect(db.any).toHaveBeenCalledWith(expect.anything(), paramMatcher);
  });
});
