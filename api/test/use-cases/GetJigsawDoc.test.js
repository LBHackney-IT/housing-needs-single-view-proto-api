describe('GetJigsawDoc', () => {
  let getJigsawDoc;

  beforeEach(() => {
    jigsawDocGateway = {
      execute: jest.fn(() => [])
    };

    getJigsawDoc = require('../../lib/use-cases/GetJigsawDoc.js')({
      jigsawDocGateway
    });
  });

  it('can query document from jigsaw gateway with the correct document id', async () => {
    const jigsawDocId = 1;
    await getJigsawDoc(jigsawDocId);
    expect(jigsawDocGateway.execute).toHaveBeenCalledWith(jigsawDocId);
  });
});
