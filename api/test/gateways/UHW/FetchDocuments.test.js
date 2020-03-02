const UHWFetchDocuments = require('../../../lib/gateways/UHW/FetchDocuments');

describe('UHWFetchDocumentsGateway', () => {
  let buildDocument;
  let db;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildDocument = jest.fn();

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return UHWFetchDocuments({
      buildDocument,
      db,
      getSystemId
    });
  };

  it('gets the docs if customer has a system id', async () => {
    const gateway = createGateway([], true);
    const id = '123';
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
  });

  it('does not get the docs if customer does not have a system id', async () => {
    const gateway = createGateway([], false);

    const documents = await gateway.execute();

    expect(db.request).not.toHaveBeenCalled();
    expect(documents.length).toBe(0);
  });

  it('builds a document', async () => {
    const document = { DocNo: '1231' };
    const gateway = createGateway([document], true);

    await gateway.execute({});
    const paramMatcher = expect.objectContaining({ id: '1231' });
    expect(buildDocument).toHaveBeenCalledWith(paramMatcher);
  });

  it('returns an empty set of records if there is an error', async () => {
    const document = { DocNo: '1231' };
    const gateway = createGateway([document], true, true);

    const documents = await gateway.execute('1');

    expect(buildDocument).not.toHaveBeenCalled();
    expect(documents.length).toBe(0);
  });
});
