describe('FetchDocumentImage Gateway', () => {
  let getJigsawDocumentGateway;
  let doJigsawGetRequest;

  const createGateway = throwsError => {
    doJigsawGetRequest = jest.fn(() => {
      if (throwsError) {
        throw new Error('error');
      } else return [];
    });
    login = jest.fn(() => 'fake token');

    getJigsawDocumentGateway = require('../../gateways/FetchDocumentImage')({
      doJigsawGetRequest
    });
  };

  it('can query for jigsaw document with correct url and headers', async () => {
    createGateway();
    await getJigsawDocumentGateway.execute(123);
    expect(doJigsawGetRequest).toHaveBeenCalledWith(
      `${process.env.JigsawHomelessnessBaseSearchUrl}/api/blobdownload/123`,
      {},
      true
    );
  });

  //this is not accurate
  it('catches an error when one is thrown', async () => {
    createGateway(true);
    id = 123;
    expect(await getJigsawDocumentGateway.execute(123)).toBeUndefined();
  });
});
