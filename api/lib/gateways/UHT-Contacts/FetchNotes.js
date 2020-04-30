const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchActionDiaryNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const Logger = options.Logger;

  const fetchHouseRef = async id => {
    if (id) {
      const houseRef = id.split('/')[0];
      return houseRef;
    }
  };

  async function fetchActionDiaryNotes(house_ref) {
    return await db.request(fetchActionDiaryNotesSQL, [
      { id: 'house_ref', type: 'NVarChar', value: house_ref }
    ]);
  }

  const processNotes = function(notes) {
    return notes.map(note => {
      return buildNote({
        id: note.araction_sid,
        title: 'Action Diary Note',
        text: note.action_comment,
        date: formatRecordDate(note.action_date),
        user: note.username,
        system: Systems.UHT_ACTION_DIARY
      });
    });
  };

  return {
    execute: async id => {
      try {
        const houseRef = await fetchHouseRef(id);
        if (houseRef) {
          const notes = await fetchActionDiaryNotes(houseRef);
          return processNotes(notes);
        }
      } catch (err) {
        Logger.error(`Error fetching notes in UHT-Contacts: ${err}`, err);
      }
      return [];
    }
  };
};
