describe('FetchDocuments', () => {
  const docsFromA = [
    { id: 2, date: new Date(2012, 8, 4) },
    { id: 1, date: new Date(2010, 5, 12) }
  ];
  const docsFromB = [{ id: 5, date: new Date(2014, 2, 2) }];
  const customerLinks = [{ name: 'UHT' }, { name: 'UHW' }, { name: 'Jigsaw' }];
  let gateways;
  let fetchDocuments;

  beforeEach(() => {
    gateways = {
      UHT: { execute: jest.fn(() => docsFromA) },
      UHW: { execute: jest.fn(() => docsFromB) }
    };
    fetchDocuments = require('../../lib/use-cases/FetchDocuments')({
      gateways: gateways,
      db: {
        any: jest.fn(async () => {
          return customerLinks;
        })
      }
    });
  });

  it('can query for a customers documents from multiple gateways', async () => {
    const id = 1;

    await fetchDocuments(id);

    for (const [_, gateway] of Object.entries(gateways)) {
      expect(gateway.execute).toHaveBeenCalledWith(id);
    }
  });

  it('concatenates the results', async () => {
    const expectedDocuments = { documents: [].concat(docsFromB, docsFromA) };
    const documents = await fetchDocuments();

    expect(documents).toEqual(expectedDocuments);
    expect(documents.length).toEqual(expectedDocuments.length);
  });

  it('can sort the documents by date descending', async () => {
    const expectedDocuments = {
      documents: [].concat(docsFromA, docsFromB).sort((a, b) => b.date - a.date)
    };

    const documents = await fetchDocuments();

    expect(documents).toEqual(expect.objectContaining(expectedDocuments));
  });
});
