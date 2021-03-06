const { Systems } = require('../../lib/Constants');

describe('FetchNotes', () => {
  const notesFromA = [
    { id: 2, date: new Date(2012, 8, 4) },
    { id: 1, date: new Date(2010, 5, 12) }
  ];
  const notesFromB = [{ id: 5, date: new Date(2014, 2, 2) }];
  const customerLinks = [
    { name: 'UHT', remote_id: 1 },
    { name: 'UHW', remote_id: 1 }
  ];

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

  it('concatenates the results', async () => {
    const expected = { notes: [].concat(notesFromB, notesFromA) };
    const received = await fetchNotes();

    expect(received).toEqual(expected);
    expect(received.notes.length).toEqual(expected.notes.length);
  });

  it('can sort the documents by date descending', async () => {
    const expectedNotes = {
      notes: [].concat(notesFromA, notesFromB).sort((a, b) => b.date - a.date)
    };

    const notes = await fetchNotes();

    expect(notes).toEqual(expect.objectContaining(expectedNotes));
  });
});
