const { Systems } = require('../../lib/Constants');

describe('FetchNotes', () => {
  const notesFromA = [
    { id: 2, date: new Date(2012, 8, 4) },
    { id: 1, date: new Date(2010, 5, 12) }
  ];
  const notesFromB = [{ id: 5, date: new Date(2014, 2, 2) }];
  const customerLinks = [{ name: 'UHT' }, { name: 'UHW' }];

  let gateways;
  let fetchNotes;

  beforeEach(() => {
    gateways = {
      UHT: { execute: jest.fn(() => notesFromA) },
      UHW: { execute: jest.fn(() => notesFromB) },
      Jigsaw: { execute: jest.fn(() => []) },
      SINGLEVIEW: { getAll: jest.fn(() => []) }
    };
    fetchNotes = require('../../lib/use-cases/FetchNotes')({
      gateways: gateways,
      getCustomerLinks: {
        execute: jest.fn(async () => {
          return customerLinks;
        })
      }
    });
  });

  it('can query for a customers notes from multiple gateways', async () => {
    const id = 1;
    const token = 'abc';

    await fetchNotes(id, token);

    for (const link of customerLinks) {
      expect(gateways[link.name].execute).toHaveBeenCalledWith(id, token);
    }
  });

  it('queries for a customer notes from the vulnerabilities gateway', async () => {
    const id = 1;
    const token = 'abc';

    await fetchNotes(id, token);

    expect(gateways[Systems.SINGLEVIEW].getAll).toHaveBeenCalledWith(id);
  });

  it('concatenates the results', async () => {
    const expectedNotes = { notes: [].concat(notesFromB, notesFromA) };
    const notes = await fetchNotes();

    expect(notes).toEqual(expectedNotes);
    expect(notes.length).toEqual(expectedNotes.length);
  });

  it('can sort the documents by date descending', async () => {
    const expectedNotes = {
      notes: [].concat(notesFromA, notesFromB).sort((a, b) => b.date - a.date)
    };

    const notes = await fetchNotes();

    expect(notes).toEqual(expect.objectContaining(expectedNotes));
  });
});
