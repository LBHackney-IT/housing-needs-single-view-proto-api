describe('FetchDocumentImage Gateway', () => {
  let getJigsawDocumentGateway;
  let login;

  beforeEach(() => {
    doGetDocRequest = jest.fn((url, qs, headers) => []);
    login = jest.fn(() => 'fake token');

    getJigsawDocumentGateway = require('../../../lib/gateways/Jigsaw/FetchDocumentImage')(
      {
        doGetDocRequest,
        login
      }
    );
  });

  it('can login', async () => {
    await getJigsawDocumentGateway.execute();
    expect(login).toHaveBeenCalled();
  });

  it('can query for jigsaw document with correct url and headers', async () => {
    id = 123;
    await getJigsawDocumentGateway.execute(123);
    expect(
      doGetDocRequest
    ).toHaveBeenCalledWith(
      'https://zebrahomelessnessproduction.azurewebsites.net/api/blobdownload/123',
      null,
      { Authorization: 'Bearer fake token' }
    );
  });
});
