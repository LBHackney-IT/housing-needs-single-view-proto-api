const { Systems } = require('../../Constants');
const path = require('path');
const { loadSQL } = require('../../Utils');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    const systemId = await getSystemId.execute(
      Systems.UHT_HOUSING_REGISTER,
      id
    );
    if (systemId) return systemId;
  };

  const fetchCustomerNotes = async systemId => {
    const [app_ref, person_no] = systemId.split('/');

    return await db.request(fetchCustomerNotesSQL, [
      { id: 'app_ref', type: 'NVarChar', value: app_ref },
      { id: 'person_no', type: 'Int', value: person_no }
    ]);
  };

  const processNotes = notes => {
    return notes.map(note => {
      return buildNote({
        text: note.clog_details,
        date: note.clog_date,
        user: note.username,
        title: 'Note',
        system: Systems.UHT_HOUSING_REGISTER
      });
    });
  };

  return {
    execute: async id => {
      try {
        const systemId = await fetchSystemId(id);
        if (systemId) {
          const notes = await fetchCustomerNotes(systemId);
          return processNotes(notes);
        }
        return [];
      } catch (err) {
        console.log(
          `Error fetching customer notes in UHT-HousingRegister: ${err}`
        );
        return [];
      }
    }
  };
};
