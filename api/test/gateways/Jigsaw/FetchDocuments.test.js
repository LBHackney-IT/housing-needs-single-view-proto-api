const jigsawFetchDocuments = require('../../../lib/gateways/Jigsaw/FetchDocuments');
const { Systems } = require('../../../lib/Constants');

describe('JigsawFetchDocumentsGateway', () => {
  const id = '123';
  let doJigsawGetRequest;
  let doJigsawPostRequest;
  const jigsawEnv = '_test';
  let getSystemId;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildDocument = jest.fn();

    doJigsawGetRequest = jest.fn(async () => {
      if (throwsError) {
        throw new Error('error');
      }
      return { cases: records };
    });

    doJigsawPostRequest = jest.fn(async () => {
      if (throwsError) {
        throw new Error('error');
      }
      return [{ caseDocuments: records }];
    });

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return jigsawFetchDocuments({
      doJigsawGetRequest,
      doJigsawPostRequest,
      jigsawEnv,
      buildDocument,
      getSystemId
    });
  };

  it('gets the system ID', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(Systems.JIGSAW, '123');
  });

  it('gets the docs if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);

    await gateway.execute(id);

    expect(doJigsawPostRequest).toHaveBeenCalled();
  });

  it('does not get the docs if customer does not have a system id', async () => {
    const gateway = createGateway([{ id }]);

    await gateway.execute(id);

    expect(doJigsawPostRequest).not.toHaveBeenCalled();
  });

  it('gets cases with id and url', async () => {
    const expectedUrl = `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/casecheck/${id}`;
    const gateway = createGateway([{ id }], true);

    await gateway.execute(id);

    expect(doJigsawGetRequest).toHaveBeenCalledWith(expectedUrl);
  });

  it('gets documents with id and url', async () => {
    const expectedUrl = `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/cases/getcasedocs/${id}`;
    const gateway = createGateway([{ id }], true);

    await gateway.execute(id);

    expect(doJigsawPostRequest).toHaveBeenCalledWith(
      expectedUrl,
      expect.anything()
    );
  });

  it('can build a document', async () => {
    const record = { id, name: 'test' };
    const gateway = createGateway([record], true);

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
    const gateway = createGateway([record], true, true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
