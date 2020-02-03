const jigsawFetchDocuments = require('../../../lib/gateways/Jigsaw/JigsawFetchDocuments');

describe('JigsawFetchDocumentsGateway', () => {
  let doJigsawGetRequest;
  let doJigsawPostRequest;
  let jigsawEnv = '_test';

  const createGateway = (records, throwsError) => {
    buildDocument = jest.fn(({}) => {
      return {};
    });

    doJigsawGetRequest = jest.fn(async (searchURL, search) => {
      if (throwsError) {
        throw new Error('Database error');
      }
      return { cases: records };
    });

    doJigsawPostRequest = jest.fn(async (searchURL, search) => {
      if (throwsError) {
        return new Error('Database error');
      }
      return records;
    });

    return jigsawFetchDocuments({
      doJigsawGetRequest,
      doJigsawPostRequest,
      jigsawEnv,
      buildDocument
    });
  };

  it('calls doJigsawGetRequest with id and correct `url', async () => {
    const id = '123';
    const gateway = createGateway([]);

    const searchUrlMatcher = expect.stringContaining(
      'zebrahomelessness_test.azurewebsites.net/api/casecheck/123'
    );

    await gateway.execute(id);

    expect(doJigsawGetRequest).toHaveBeenCalledWith(searchUrlMatcher);
  });

  it('calls doJigsawPostRequest with id and correct `url', async () => {
    const id = '123';
    const gateway = createGateway([{ id }]);
    const searchUrlMatcher = expect.stringContaining(
      'zebrahomelessness_test.azurewebsites.net/api/cases/getcasedocs/123'
    );

    await gateway.execute(id);

    expect(doJigsawPostRequest).toHaveBeenCalledWith(searchUrlMatcher, {});
  });

  it('builds a single document', async () => {
    const id = '123';
    const record = { id: '123', name: 'test' };
    const gateway = createGateway([record]);

    await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'test'
    });

    expect(buildDocument).toHaveBeenCalledTimes(1);
    expect(buildDocument).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty array if an error is thrown', async () => {
    const id = '123';
    const record = { id: '123' };
    const gateway = createGateway([record], true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
