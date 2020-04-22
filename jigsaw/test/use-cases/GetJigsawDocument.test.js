describe('GetJigsawDocument', () => {
  const jigsawDocId = 1;
  const jigsawDocIdTwo = 2;
  const jigsawCaseId = 3;

  let fetchDocImageGateway;
  let fetchDocMetadataGateway;

  beforeEach(() => {
    jigsawDocGateway = {
      execute: jest.fn(() => [])
    };

    fetchDocImageGateway = {
      execute: jest.fn()
    };

    fetchDocMetadataGateway = {
      execute: jest.fn(() => [
        {
          id: 1,
          title: 'Document',
          text: 'something.pdf',
          date: '2018-09-04 10:17:51',
          user: 'mr person',
          system: 'JIGSAW',
          format: '.pdf'
        },
        {
          id: 2,
          title: 'Document',
          date: '2018-09-04 10:17:26',
          user: 'mr person',
          system: 'JIGSAW',
          format: '.wrongtype'
        }
      ])
    };

    getJigsawDocument = require('../../use-cases/GetJigsawDocument')({
      fetchDocMetadataGateway,
      fetchDocImageGateway
    });
  });

  it('can query jigsaw fetch document metadata gateway', async () => {
    await getJigsawDocument(jigsawCaseId, jigsawDocId);
    expect(fetchDocMetadataGateway.execute).toHaveBeenCalledWith(jigsawCaseId);
  });

  it('can query jigsaw fetch document image gateway', async () => {
    await getJigsawDocument(jigsawCaseId, jigsawDocId);
    expect(fetchDocImageGateway.execute).toHaveBeenCalledWith(jigsawDocId);
  });

  describe('mime type', () => {
    it('can get first mimeType', async () => {
      const { mimeType } = await getJigsawDocument(jigsawCaseId, jigsawDocId);
      expect(mimeType).toEqual('application/pdf');
    });
    it('can get a default mimeType', async () => {
      const { mimeType } = await getJigsawDocument(
        jigsawCaseId,
        jigsawDocIdTwo
      );
      expect(mimeType).toEqual('application/octet-stream');
    });
  });

  describe('filename', () => {
    it('can get a default filename', async () => {
      const { filename } = await getJigsawDocument(
        jigsawCaseId,
        jigsawDocIdTwo
      );
      expect(filename).toEqual('download');
    });
  });
});
