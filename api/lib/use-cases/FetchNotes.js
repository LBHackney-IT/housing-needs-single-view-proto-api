const { dedupe } = require('../Utils');

module.exports = options => {
  const gateways = options.gateways;
  const PostgresDb = require('../PostgresDb');

  let getCustomerLinks = async function(id) {
    const query = `
      SELECT customer_links.remote_id, systems.name FROM customer_links, customers, systems 
      WHERE systems.id = customer_links.system_id AND customers.id = customer_links.customer_id AND customers.id = $1`;
    return await PostgresDb.any(query, [id]);
  };

  return async (id, token) => {
    const links = await getCustomerLinks(id);
    const requests = links.map(async link =>
      gateways[link.name].execute(id, token)
    );
    // const requests = gateways.map(async gateway => gateway.execute(id, token));
    let notes = [].concat.apply([], await Promise.all(requests));
    notes = dedupe(notes, doc => JSON.stringify(doc));
    notes = notes.sort((a, b) => b.date - a.date);
    return { notes };
  };
};
