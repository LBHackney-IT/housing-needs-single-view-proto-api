const { Systems } = require('../../Constants');
const path = require('path');
const { loadSQL } = require('../../Utils');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const cominoFetchNotesGateway = options.cominoFetchNotesGateway;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    const systemId = await getSystemId.execute(Systems.ACADEMY_BENEFITS, id);
    if (systemId) return systemId.split('/')[0];
  };

  async function fetchCustomerNotes(id) {
    return await db.request(fetchCustomerNotesSQL, [
      { id: 'claim_id', type: 'NVarChar', value: id.slice(0, 7) }
    ]);
  }

  const processNotesResults = function(notes) {
    return notes
      .map(x => x.text_value)
      .join('')
      .split(/-{200}/)
      .map(x => x.trim())
      .filter(x => x !== '')
      .map(note => {
        const [meta, ...noteText] = note.trim().split('\n');
        const parsedMeta = meta
          .trim()
          .match(
            /User Id: ([^ ]+) {2}Date: (\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/
          );
        return buildNote({
          id: null,
          title: 'Note',
          text: noteText.join('\n').trim(),
          date: new Date(
            parseInt(parsedMeta[4]),
            parseInt(parsedMeta[3]) - 1,
            parseInt(parsedMeta[2]),
            parseInt(parsedMeta[5]),
            parseInt(parsedMeta[6]),
            parseInt(parsedMeta[7])
          ),
          user: parsedMeta[1],
          system: Systems.ACADEMY_BENEFITS
        });
      })
      .filter(x => x);
  };

  return {
    execute: async id => {
      const claim_id = await fetchSystemId(id);
      try {
        if (claim_id) {
          const academyNotes = await fetchCustomerNotes(claim_id);
          const cominoNotes = await cominoFetchNotesGateway.execute({
            claim_id
          });
          return processNotesResults(academyNotes).concat(cominoNotes);
        }
        return [];
      } catch (err) {
        console.log(
          `Error fetching customer notes in Academy-Benefits: ${err}`
        );
        return [];
      }
    }
  };
};
