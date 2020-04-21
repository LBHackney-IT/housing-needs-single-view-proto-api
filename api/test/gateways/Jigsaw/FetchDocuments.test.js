const jigsawFetchDocuments = require('../../../lib/gateways/Jigsaw/FetchDocuments');

describe('JigsawFetchDocumentsGateway', () => {
  const id = '123';
  let fetchDocMetadataGateway;

  const createGateway = (records, throwsError) => {
    buildDocument = jest.fn();

    fetchDocMetadataGateway = {
      execute: jest.fn(async () => {
        if (throwsError) {
          throw new Error('error');
        }
        return records;
      })
    };

    return jigsawFetchDocuments({
      fetchDocMetadataGateway,
      buildDocument
    });
  };

  it('gets the docs if customer has a system id', async () => {
    const gateway = createGateway([{ id }]);

    await gateway.execute(id);

    expect(fetchDocMetadataGateway.execute).toHaveBeenCalled();
  });

  it('does not get the docs if customer does not have an id', async () => {
    const gateway = createGateway([{ id }]);

    await gateway.execute(null);

    expect(fetchDocMetadataGateway.execute).not.toHaveBeenCalled();
  });

  it('gets documents with id', async () => {
    const id = '123';
    const gateway = createGateway([{ id }]);

    await gateway.execute(id);

    expect(fetchDocMetadataGateway.execute).toHaveBeenCalledWith(id);
  });

  it('can build a document', async () => {
    const record = { id, name: 'test' };
    const gateway = createGateway([record]);

    const records = await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'test'
    });
    expect(buildDocument).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildDocument).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty set of records if an error is thrown', async () => {
    const record = { id };
    const gateway = createGateway([record], true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
