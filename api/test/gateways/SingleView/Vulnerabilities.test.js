const vulnerabilitiesGateway = require('../../../lib/gateways/SingleView/Vulnerabilities');

describe('VulnerabilitiesGateway', () => {
  let db;
  let buildNote;

  const createGateway = (throwsError, records) => {
    buildNote = jest.fn();

    db = {
      one: jest.fn(async () => {
        if (throwsError) {
          throw new Error('db error');
        }
        return { id: 1 };
      }),
      any: jest.fn(async () => {
        if (throwsError) {
          throw new Error('db error');
        }
        return records;
      })
    };

    return vulnerabilitiesGateway({
      buildNote,
      db
    });
  };

  it('creates a vulnerability', async () => {
    const vun = {
      customerId: 1,
      text: 'this is the text',
      user: 'joe bloggs'
    };
    const gateway = createGateway();

    const result = await gateway.create(vun);

    expect(db.one).toHaveBeenCalledWith(expect.anything(), [
      vun.customerId,
      vun.text,
      vun.user
    ]);
    expect(result).not.toBeUndefined();
  });

  it('does not create a vulnerability if error', async () => {
    const vun = {
      customerId: 1,
      text: 'this is the text',
      user: 'joe bloggs'
    };
    const gateway = createGateway(true);

    const result = await gateway.create(vun);

    expect(result).toBeUndefined();
  });

  it('gets the vulnerabilities', async () => {
    const customerId = 12;
    const text = 'note text';
    const gateway = createGateway(false, [{ id: 1, customerId, text }]);

    await gateway.getAll(customerId);

    expect(db.any).toHaveBeenCalledWith(expect.anything(), [customerId]);
    expect(buildNote).toHaveBeenCalledWith(expect.objectContaining({ text }));
  });

  it('returns an empty set of vulnerabilities if there is an error', async () => {
    const gateway = createGateway(true);

    const records = await gateway.getAll(1);

    expect(buildNote).not.toHaveBeenCalled();
    expect(records.length).toBe(0);
  });
});
