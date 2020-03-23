describe('fetchJigsawDocument', () => {
  let fetchJigsawDocument;

  beforeEach(() => {
    jigsawDocGateway = {
      execute: jest.fn(() => [])
    };

    fetchJigsawDocument = require('../../lib/use-cases/FetchJigsawDocument')({
      jigsawDocGateway
    });
  });

  it('can query document from jigsaw gateway with the correct document id', async () => {
    const jigsawDocId = 1;
    await fetchJigsawDocument(jigsawDocId);
    expect(jigsawDocGateway.execute).toHaveBeenCalledWith(jigsawDocId);
  });
});
