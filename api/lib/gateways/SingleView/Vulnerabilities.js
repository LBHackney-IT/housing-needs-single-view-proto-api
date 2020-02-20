const { Systems } = require('../../Constants');
const path = require('path');
const { loadSQL } = require('../../Utils');

const { createVulnerabilitySQL, fetchVulnerabilitiesSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

module.exports = options => {
  const db = options.db;
  const buildNote = options.buildNote;

  return {
    create: async vun => {
      try {
        const result = await db.one(createVulnerabilitySQL, [
          vun.customerId,
          vun.text,
          vun.user
        ]);
        if (result) return result.id;
      } catch (err) {
        console.log(err);
      }
    },
    getAll: async customerId => {
      try {
        const results = await db.any(fetchVulnerabilitiesSQL, [customerId]);

        return results.map(v =>
          buildNote({
            id: v.id,
            title: 'Note',
            text: v.text,
            date: v.created_at,
            user: v.system_user,
            system: Systems.SINGLEVIEW
          })
        );
      } catch (err) {
        console.log(err);
        return [];
      }
    }
  };
};
