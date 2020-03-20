describe('GetJigsawDocument Gateway', async () => {
  let getJigsawDocumentGateway;

  beforeEach(() => {
    request = {
      get: jest.fn(() => [])
    };

    getJigsawDocumentGateway = require('../../../lib/gateways/Jigsaw/GetJigsawDocument')(
      {
        request
      }
    );
  });

  it("can query for a customer's records from multiple gateways", async () => {
    const id = 123;
    await getJigsawDocumentGateway.execute(id);
    expect().toHaveBeenCalledWith(jigsawDocId);
  });
});
