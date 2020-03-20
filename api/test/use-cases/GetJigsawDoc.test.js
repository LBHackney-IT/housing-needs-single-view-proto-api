describe('GetJigsawDoc', () => {
  let getJigsawDoc;

  beforeEach(() => {
    jigsawDocGateway = {
      execute: jest.fn(() => [])
    };

    getJigsawDoc = require('../../lib/use-cases/GetJigsawDoc.js')({});
  });

  it("can query for a customer's records from multiple gateways", async () => {
    const jigsawDocId = 1;

    await getJigsawDoc(jigsawDocId);

    expect(jigsawDocGateway.execute).toHaveBeenCalledWith();
  });
});
