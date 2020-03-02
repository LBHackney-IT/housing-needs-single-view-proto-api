const { dedupe } = require('../Utils');
const { Systems } = require('../Constants');

module.exports = options => {
  const gateways = options.gateways;
  const getCustomerLinks = options.getCustomerLinks;

  return async (id, token) => {
    const links = await getCustomerLinks.execute(id);
    const requests = links.map(async link => {
      if (gateways[link.name] && link.remote_id)
        return gateways[link.name].execute(link.remote_id, token);
    });

    requests.push(gateways[Systems.SINGLEVIEW].getAll(id));

    let notes = [].concat.apply([], await Promise.all(requests));
    notes = dedupe(notes, doc => JSON.stringify(doc));
    notes = notes.sort((a, b) => b.date - a.date);
    return { notes };
  };
};
