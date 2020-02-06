describe('FetchNotes', () => {
  const notesFromA = [
    { id: 2, date: new Date(2012, 8, 4) },
    { id: 1, date: new Date(2010, 5, 12) }
  ];
  const notesFromB = [{ id: 5, date: new Date(2014, 2, 2) }];
  const notesFromC = [{ id: 5, date: new Date(2014, 2, 2) }];

  let gateways;
  let fetchNotes;

  beforeEach(() => {
    gateways = [
      {
        execute: jest.fn(() => notesFromA)
      },
      {
        execute: jest.fn(() => notesFromB)
      }
    ];
    fetchNotes = require('../../lib/use-cases/FetchNotes')({
      gateways
    });
  });

  it('can query for a customer notes from multiple gateways', async () => {
    const id = 1;
    const token = 'abc';

    await fetchNotes(id, token);

    gateways.forEach(gateway => {
      expect(gateway.execute).toHaveBeenCalledWith(id, token);
    });
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