const { dedupe, loadSQL } = require('../Utils');
const path = require('path');

const { fetchCustomerLinksSQL } = loadSQL(path.join(__dirname, 'sql'));

module.exports = options => {
  const gateways = options.gateways;
  const db = options.db;

  let getCustomerLinks = async function(id) {
    return await db.any(fetchCustomerLinksSQL, [id]);
  };

  return async id => {
    const links = await getCustomerLinks(id);

    const requests = links.map(async link => {
      if (gateways[link.name]) return gateways[link.name].execute(id);
    });

    let documents = [].concat.apply([], await Promise.all(requests));
    documents = dedupe(documents, doc => JSON.stringify(doc));
    documents = documents.sort((a, b) => b.date - a.date);
    return { documents };
  };
};
