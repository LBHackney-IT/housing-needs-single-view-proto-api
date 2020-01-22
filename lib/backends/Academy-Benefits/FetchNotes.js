const path = require('path');
const { formatRecordDate, loadSQL } = require('../../Utils');
const Comino = require('../Comino');
const { Systems } = require('../../Constants');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

async function fetchCustomerNotes(id, db) {
  const claim_id = id.split('/')[0];

  return await db.request(fetchCustomerNotesSQL, [
    { id: 'claim_id', type: 'NVarChar', value: claim_id.slice(0, 7) }
  ]);
}

let processNotesResults = function(results) {
  return results
    .map(x => x.text_value)
    .join('')
    .split(/-{200}/)
    .map(x => x.trim())
    .filter(x => x !== '')
    .map(note => {
      try {
        let [meta, ...noteText] = note.trim().split('\n');
        let parsedMeta = meta
          .trim()
          .match(
            /User Id: ([^ ]+) {2}Date: (\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/
          );
        return {
          title: 'Note',
          text: noteText.join('\n').trim(),
          date: formatRecordDate(
            new Date(
              parseInt(parsedMeta[4]),
              parseInt(parsedMeta[3]) - 1,
              parseInt(parsedMeta[2]),
              parseInt(parsedMeta[5]),
              parseInt(parsedMeta[6]),
              parseInt(parsedMeta[7])
            )
          ),
          user: parsedMeta[1],
          system: Systems.ACADEMY_BENEFITS
        };
      } catch (err) {
        console.log(`Error parsing notes in Academy-Benefits: ${err}`);
        return null;
      }
    })
    .filter(x => x);
};

module.exports = options => {
  const db = options.db;

  return async id => {
    try {
      const claim_id = id.split('/')[0];
      const academyResults = await fetchCustomerNotes(id, db);
      const cominoResults = await Comino.fetchCustomerNotes({ claim_id });
      return processNotesResults(academyResults).concat(cominoResults);
    } catch (err) {
      console.log(`Error fetching customer notes in Academy-Benefits: ${err}`);
    }
  };
};
