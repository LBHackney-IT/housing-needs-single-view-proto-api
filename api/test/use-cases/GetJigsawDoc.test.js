describe('fetchJigsawDocument', () => {
  const jigsawDocId = 1;
  const jigsawDocIdTwo = 2;
  const userId = 3;

  let fetchJigsawDocument;

  beforeEach(() => {
    jigsawDocGateway = {
      execute: jest.fn(() => [])
    };

    jigsawMetadataGateway = {
      execute: jest.fn(() => [
        {
          userid: '3',
          id: 1,
          title: 'Document',
          text: 'something.pdf',
          date: '2018-09-04 10:17:51',
          user: 'mr person',
          system: 'JIGSAW',
          format: '.pdf'
        },
        {
          userid: '3',
          id: 2,
          title: 'Document',
          date: '2018-09-04 10:17:26',
          user: 'mr person',
          system: 'JIGSAW',
          format: '.wrongtype'
        }
      ])
    };

    fetchJigsawDocument = require('../../lib/use-cases/FetchJigsawDocument')({
      jigsawDocGateway,
      jigsawMetadataGateway
    });
  });

  it('can query jigsaw fetch documents gateway for metadata with correct user ID', async () => {
    await fetchJigsawDocument(jigsawDocId, userId);
    expect(jigsawMetadataGateway.execute).toHaveBeenCalledWith(userId);
  });

  it('can query document from jigsaw gateway with the correct document id', async () => {
    await fetchJigsawDocument(jigsawDocId, userId);
    expect(jigsawDocGateway.execute).toHaveBeenCalledWith(jigsawDocId);
  });

  describe('mime type', async () => {
    it('can get first mimeType', async () => {
      const { mimeType } = await fetchJigsawDocument(jigsawDocId, userId);
      expect(mimeType).toEqual('application/pdf');
    });
    it('can get a default mimeType', async () => {
      const { mimeType } = await fetchJigsawDocument(jigsawDocIdTwo, userId);
      expect(mimeType).toEqual('application/octet-stream');
    });
  });

  describe('filename', () => {
    it('can get first filename', async () => {
      const { filename } = await fetchJigsawDocument(jigsawDocId, userId);
      expect(filename).toEqual('something.pdf');
    });
    it('can get a default filename', async () => {
      const { filename } = await fetchJigsawDocument(jigsawDocIdTwo, userId);
      expect(filename).toEqual('download');
    });
  });
});
