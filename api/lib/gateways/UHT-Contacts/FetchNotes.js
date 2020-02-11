const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchActionDiaryNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    return await getSystemId.execute(Systems.UHT_CONTACTS, id);
  };

  async function fetchActionDiaryNotes(id) {
    const [house_ref, person_no] = id.split('/');

    return await db.request(fetchActionDiaryNotesSQL, [
      { id: 'house_ref', type: 'NVarChar', value: house_ref }
    ]);
  }

  const processNotes = function(notes) {
    return notes.map(note => {
      return buildNote({
        id: null,
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
        const uht_contacts_id = await fetchSystemId(id);
        if (uht_contacts_id) {
          const notes = await fetchActionDiaryNotes(uht_contacts_id);
          return processNotes(notes);
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customers in UHT-ActionDiary: ${err}`);
      }
    }
  };
};
