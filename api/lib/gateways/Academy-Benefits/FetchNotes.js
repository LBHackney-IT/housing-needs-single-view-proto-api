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

  const fetchCustomerNotes = async id => {
    return await db.request(fetchCustomerNotesSQL, [
      { id: 'claim_id', type: 'NVarChar', value: id.slice(0, 7) }
    ]);
  };

  const cleanupNotes = notes => {
    return notes
      .map(x => x.text_value)
      .join('')
      .split(/-{200}/)
      .map(x => x.trim())
      .filter(x => x);
  };
  new Date();
  const constructDate = metadata => {
    return new Date(
      parseInt(metadata[4]),
      parseInt(metadata[3]) - 1,
      parseInt(metadata[2]),
      parseInt(metadata[5]),
      parseInt(metadata[6]),
      parseInt(metadata[7])
    );
  };

  const deconstructNote = note => {
    const [meta, ...text] = note.trim().split('\n');

    const parsedMeta = meta
      .trim()
      .match(
        /User Id: ([^ ]+) {2}Date: (\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2}) {2}([^ ]+)/
      );
    const date = constructDate(parsedMeta);
    const user = parsedMeta[1];
    const id = parsedMeta[8];

    return {
      id,
      text: text.join('\n').trim(),
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
