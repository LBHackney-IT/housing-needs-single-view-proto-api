const path = require('path');
const { loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');

const { fetchCTCustomerNotesSQL, fetchHBCustomerNotesSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;

  const fetchHBCustomerNotes = async id => {
    return await db.request(fetchHBCustomerNotesSQL, [
      { id: 'claim_id', type: 'NVarChar', value: id }
    ]);
  };

  const fetchCTCustomerNotes = async id => {
    return await db.request(fetchCTCustomerNotesSQL, [
      { id: 'account_ref', type: 'NVarChar', value: id }
    ]);
  };

  const processNotes = notes => {
    return notes.map(note => {
      return buildNote({
        title: 'Note',
        text: note.NoteText.replace(/Â£/g, '£'), // Fixes a common encoding issue
        date: note.NDate,
        user: note.UserID,
        system: Systems.COMINO
      });
    });
  };

  return {
    execute: async queryParams => {
      try {
        if (queryParams.claim_id) {
          return processNotes(await fetchHBCustomerNotes(queryParams.claim_id));
        } else if (queryParams.account_ref) {
          return processNotes(
            await fetchCTCustomerNotes(queryParams.account_ref)
          );
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer notes in Comino: ${err}`);
        return [];
      }
    }
  };
};
