describe('FetchDocuments', () => {
  const docsFromA = [
    { id: 2, date: new Date(2012, 8, 4) },
    { id: 1, date: new Date(2010, 5, 12) }
  ];
  const docsFromB = [{ id: 5, date: new Date(2014, 2, 2) }];
  const customerLinks = [
    { name: 'UHT', remote_id: 10 },
    { name: 'UHW', remote_id: 10 },
    { name: 'Jigsaw', remote_id: 10 }
  ];
  const token = 'a_token';
  let gateways;
  let fetchDocuments;

  beforeEach(() => {
    gateways = {
      UHT: { execute: jest.fn(() => docsFromA) },
      UHW: { execute: jest.fn(() => docsFromB) }
    };
    fetchDocuments = require('../../lib/use-cases/FetchDocuments')({
      gateways: gateways,
      getCustomerLinks: {
        execute: jest.fn(async () => {
          return customerLinks;
        })
      }
    });
  });

  it('can query for a customers documents from multiple gateways', async () => {
    const id = 1;

    await fetchDocuments(id, token);

    for (const [_, gateway] of Object.entries(gateways)) {
      expect(gateway.execute).toHaveBeenCalledWith(10, token);
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
