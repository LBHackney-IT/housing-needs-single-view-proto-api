const path = require('path');
const { formatRecordDate, loadSQL } = require('@lib/Utils');
const { Systems } = require('@lib/Constants');
const { fetchCustomerNotesSQL } = loadSQL(path.join(__dirname, 'sql'));

const fetchCustomerNotesQuery = async (id, db) => {
  const [app_ref, person_no] = id.split('/');

  return await db.request(fetchCustomerNotesSQL, [
    { id: 'app_ref', type: 'NVarChar', value: app_ref },
    { id: 'person_no', type: 'Int', value: person_no }
  ]);
};

const processNotesResults = results => {
  return results.map(note => {
    return {
      text: note.clog_details,
      date: formatRecordDate(note.clog_date),
      user: note.username,
      title: 'Note',
      system: Systems.UHT_HOUSING_REGISTER
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
      console.log(
        `Error fetching customer notes in UHT-HousingRegister: ${err}`
      );
    }
  };
};
