const { dedupe } = require('../Utils');

module.exports = options => {
  const gateways = options.gateways;
  const getCustomerLinks = options.getCustomerLinks;

  return async id => {
    const links = await getCustomerLinks.execute(id);
    const requests = links.map(async link => {
      if (gateways[link.name]) return gateways[link.name].execute(id);
    });

    let documents = [].concat.apply([], await Promise.all(requests));
    documents = dedupe(documents, doc => JSON.stringify(doc));
    documents = documents.sort((a, b) => b.date - a.date);
    return { documents };
  };
};
