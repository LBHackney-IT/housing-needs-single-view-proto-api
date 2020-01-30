const { dedupe } = require('../Utils');

module.exports = options => {
  const gateways = options.gateways;

  return async id => {
    const requests = gateways.map(async gateway => gateway.execute(id));
    let documents = [].concat.apply([], await Promise.all(requests));
    documents = dedupe(documents, doc => JSON.stringify(doc));
    // documents = documents.sort((a, b) => b.date - a.date);
    return { documents };
  };
};
