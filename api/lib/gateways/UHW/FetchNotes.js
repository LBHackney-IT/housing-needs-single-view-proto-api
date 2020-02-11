const { Systems } = require('../../Constants');
const path = require('path');
const { loadSQL } = require('../../Utils');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    const systemId = await getSystemId.execute(Systems.UHW, id);
    if (systemId) return systemId;
  };

  const fetchCustomerNotes = async id => {
    return await db.request(fetchCustomerNotesSQL, [
      { id: 'id', type: 'Int', value: id }
    ]);
  };

  const processNotes = notes => {
    return notes.map(note => {
      return buildNote({
        id: note.NoteID,
        title: 'Note',
        text: note.NoteText,
        date: note.NDate,
        user: note.UserID,
        system: Systems.UHW
      });
    });
  };

  return {
    execute: async id => {
      try {
        const claim_id = await fetchSystemId(id);
        if (claim_id) {
          const results = await fetchCustomerNotes(claim_id);
          return processNotes(results);
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer notes in UHW: ${err}`);
        return [];
      }
    }
  };
};
