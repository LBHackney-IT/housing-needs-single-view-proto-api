const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchActionDiaryNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const getSystemId = options.getSystemId;

  const fetchHouseRef = async id => {
    const systemId = await getSystemId.execute(Systems.UHT_CONTACTS, id);
    const [houseRef, personNo] = systemId.split('/');
    return houseRef;
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
        console.log(`Error fetching customers in UHT-ActionDiary: ${err}`);
      };
      return [];
    }
  };
};
