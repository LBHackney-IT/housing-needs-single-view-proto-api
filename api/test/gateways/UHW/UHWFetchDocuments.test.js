const UHWFetchDocuments = require('../../../lib/gateways/UHW/UHWFetchDocuments');

describe('UHWFetchDocumentsGateway', () => {
  let buildDocument;
  let db;

  const createGateway = (records, throwsError) => {
    buildDocument = jest.fn();

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    return UHWFetchDocuments({
      buildDocument,
      db
    });
  };

  it('queries the database with the id if the query contains ID', async () => {
    const gateway = createGateway([]);
    const id = '123';
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
  });

  it('does not query the db for id if the query does not contain id', async () => {
    const gateway = createGateway([]);

    const documents = await gateway.execute();

    expect(db.request).toHaveBeenCalledTimes(0);
    expect(documents.length).toBe(0);
  });

  it('builds a document', async () => {
    const document = { DocNo: '1231' };
    const gateway = createGateway([document]);

    const documents = await gateway.execute({});
    const paramMatcher = expect.objectContaining({ id: '1231' });
    expect(buildDocument).toHaveBeenCalledWith(paramMatcher);
    expect(documents.length).toBe(1);
  });

  it('returns an empty set of records if there is an error', async () => {
    const document = { DocNo: 1231 };
    const gateway = createGateway([document], true);

    const documents = await gateway.execute('1');

    expect(buildDocument).not.toHaveBeenCalled();
    expect(documents.length).toBe(0);
  });
});
