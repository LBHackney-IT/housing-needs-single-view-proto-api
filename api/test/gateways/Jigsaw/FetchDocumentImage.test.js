describe('FetchDocumentImage Gateway', () => {
  let getJigsawDocumentGateway;
  let login;

  const createGateway = throwsError => {
    doGetDocRequest = jest.fn((url, qs, headers) => {
      if (throwsError) {
        throw new Error('error');
      } else return [];
    });
    login = jest.fn(() => 'fake token');

    getJigsawDocumentGateway = require('../../../lib/gateways/Jigsaw/FetchDocumentImage')(
      {
        doGetDocRequest,
        login
      }
    );
  };

  it('can login', async () => {
    createGateway();
    await getJigsawDocumentGateway.execute();
    expect(login).toHaveBeenCalled();
  });

  it('can query for jigsaw document with correct url and headers', async () => {
    createGateway();
    id = 123;
    await getJigsawDocumentGateway.execute(123);
    expect(
      doGetDocRequest
    ).toHaveBeenCalledWith(
      `${process.env.JigsawHomelessnessBaseSearchUrl}/api/blobdownload/123`,
      { Authorization: 'Bearer fake token' }
    );
  });

  //this is not accurate
  it('catches an error when one is thrown', async () => {
    createGateway(true);
    id = 123;
    expect(await getJigsawDocumentGateway.execute(123)).not.toEqual([]);
  });
});
