const path = require('path');
const { Systems } = require('../../Constants');
const { loadSQL } = require('../../Utils');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const cominoFetchNotesGateway = options.cominoFetchNotesGateway;

  const fetchSystemId = async id => {
    if (id) return id.split('/')[0];
  };

  const fetchCustomerNotes = async id => {
    return await db.request(fetchCustomerNotesSQL, [
      { id: 'claim_id', type: 'NVarChar', value: id.slice(0, 7) }
    ]);
  };

  const cleanupNotes = notes => {
    return notes
      .map(x => x.text_value)
      .join('')
      .replace(/\n/g, '')
      .split(/-{200}/)
      .map(x => x.trim())
      .filter(x => x);
  };

  const constructDate = metadata => {
    const year = parseInt(metadata[4]);
    const month = parseInt(metadata[3]) - 1;
    const day = parseInt(metadata[2]);
    const hour = parseInt(metadata[5]);
    const minute = parseInt(metadata[6]);
    const second = parseInt(metadata[7]);

    return new Date(year, month, day, hour, minute, second);
  };

  const deconstructNote = note => {
    const meta = note
      .trim()
      .match(
        /User Id: ([^ ]+) {2}Date: (\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2}) {2}([^ ]+)\s*(.*)/
      );
    const date = constructDate(meta);
    const user = meta[1];
    const id = meta[8];
    const text = meta[9].trim();

    return {
      id,
      text,
      date,
      user
    };
  };

  const processNotesResults = function(notes) {
    return cleanupNotes(notes).map(note => {
      const noteData = deconstructNote(note);
      return buildNote({
        id: noteData.id,
        title: 'Note',
        text: noteData.text,
        date: noteData.date,
        user: noteData.user,
        system: Systems.ACADEMY_BENEFITS
      });
    });
  };

  return {
    execute: async id => {
      try {
        const claim_id = await fetchSystemId(id);
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
