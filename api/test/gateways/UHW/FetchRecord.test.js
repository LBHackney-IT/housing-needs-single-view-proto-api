const UHWFetchRecord = require('../../../lib/gateways/UHW/FetchRecord');

describe('UHWFetchRecord gateway', () => {
  let db;

  const createGateway = (customer, throwsError) => {
    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return customer;
      })
    };

    return UHWFetchRecord({
      db
    });
  };

  it('queries the database with appropriate id', async () => {
    const gateway = createGateway([]);
    const id = '8852263';
    const idQueryMatcher = expect.stringMatching(/id = @id/);

    const paramMatcher = expect.arrayContaining([
      {
        id: 'id',
        type: 'Int',
        value: id
      }
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(idQueryMatcher, paramMatcher);
  });

  it('returns nicely formatted customer data', async () => {
    const id = '4/1';

    const customer = {
      ContactNo: '4186867',
      Title: 'Ms',
      Forenames: 'Arlyn',
      Surname: 'Wilce',
      DOB: new Date('1973-08-23T00:00:00.000Z'),
      Addr1: null,
      Addr2: null,
      Addr3: null,
      Addr4: null,
      PostCode: null,
      EmailAddress: 'Arlyn.W@yahoo.com',
      UHContact: 3651747
    };

    const gateway = createGateway([customer]);

    const record = await gateway.execute(id);
    expect(record).toEqual(
      expect.objectContaining({
        dob: ['1973-08-23 01:00:00'],
        email: ['Arlyn.W@yahoo.com'],
        name: [{ first: 'Arlyn', last: 'Wilce', title: 'Ms' }],
        postcode: [null],
        systemIds: { uhw: ['4186867'] }
      })
    );
  });

  it('catches and console logs errors', async () => {
    let consoleOutput = '';
    const storeLog = inputs => (consoleOutput += inputs);
    console['log'] = jest.fn(storeLog);

    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(consoleOutput).toBe(
      'Error fetching customers in UHW: Error: Database error'
    );
  });
});
