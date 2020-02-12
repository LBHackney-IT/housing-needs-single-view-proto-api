const { dedupe, loadSQL } = require('../Utils');
const path = require('path');

const { fetchCustomerLinksSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const gateways = options.gateways;
  const db = options.db;

  let getCustomerLinks = async function(id) {
    return await db.any(fetchCustomerLinksSQL, [id]);
  };

  return async (id, token) => {
    const links = await getCustomerLinks(id);
    const requests = links.map(async link => {
      if (gateways[link.name]) return gateways[link.name].execute(id, token);
    });
    // const requests = gateways.map(async gateway => gateway.execute(id, token));
    let notes = [].concat.apply([], await Promise.all(requests));
    notes = dedupe(notes, doc => JSON.stringify(doc));
    notes = notes.sort((a, b) => b.date - a.date);
    return { notes };
  };
};
