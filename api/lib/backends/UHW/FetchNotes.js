const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const { Systems } = require('../../Constants');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

const fetchCustomerNotesQuery = async (id, db) => {
  return await db.request(fetchCustomerNotesSQL, [
    { id: 'id', type: 'Int', value: id }
  ]);
};

const processNotesResults = results => {
  return results.map(note => {
    return {
      title: 'Note',
      text: note.NoteText,
      date: formatRecordDate(note.NDate),
      user: note.UserID,
      system: Systems.UHW
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const results = await fetchCustomerNotesQuery(id, db);
      return processNotesResults(results);
    } catch (err) {
      console.log(`Error fetching customer notes in UHW: ${err}`);
    }
  };
};
