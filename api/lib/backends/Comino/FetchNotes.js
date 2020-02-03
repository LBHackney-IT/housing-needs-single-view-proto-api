const path = require('path');
const { formatRecordDate, loadSQL } = require('@lib/Utils');
const { Systems } = require('@lib/Constants');

const { fetchCTCustomerNotesSQL, fetchHBCustomerNotesSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

const fetchCTCustomerNotes = async (id, db) => {
  return await db.request(fetchCTCustomerNotesSQL, [
    { id: 'account_ref', type: 'NVarChar', value: id }
  ]);
};

const fetchHBCustomerNotes = async (id, db) => {
  return await db.request(fetchHBCustomerNotesSQL, [
    { id: 'claim_id', type: 'NVarChar', value: id }
  ]);
};

const processNotesResults = results => {
  return results.map(note => {
    return {
      title: 'Note',
      text: note.NoteText.replace(/Â£/g, '£'), // Fixes a common encoding issue
      date: formatRecordDate(note.NDate),
      user: note.UserID,
      system: Systems.COMINO
    };
  });
};

module.exports = options => {
  const db = options.db;

  return async query => {
    let results;
    try {
      if (query.claim_id) {
        results = await fetchHBCustomerNotes(query.claim_id, db);
      } else if (query.account_ref) {
        results = await fetchCTCustomerNotes(query.account_ref, db);
      }
      return processNotesResults(results);
    } catch (err) {
      console.log(`Error fetching customer notes in Comino: ${err}`);
    }
  };
};
