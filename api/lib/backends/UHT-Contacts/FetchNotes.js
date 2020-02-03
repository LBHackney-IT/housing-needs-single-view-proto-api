const path = require('path');
const { formatRecordDate, loadSQL } = require('@lib/Utils');
const { Systems } = require('@lib/Constants');
const { fetchActionDiaryNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;

  async function fetchActionDiaryNotes(id) {
    const [house_ref, person_no] = id.split('/');

    return await db.request(fetchActionDiaryNotesSQL, [
      { id: 'house_ref', type: 'NVarChar', value: house_ref }
    ]);
  }

  const processNotes = function(notes) {
    return notes.map(note => {
      return {
        title: 'Action Diary Note',
        text: note.action_comment,
        date: formatRecordDate(note.action_date),
        user: note.username,
        system: Systems.UHT_ACTION_DIARY
      };
    });
  };

  return async id => {
    try {
      const notes = await fetchActionDiaryNotes(id);
      return processNotes(notes);
    } catch (err) {
      console.log(`Error fetching customers in UHT-ActionDiary: ${err}`);
    }
  };
};
