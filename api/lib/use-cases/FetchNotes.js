const { dedupe } = require('../Utils');

module.exports = options => {
  const gateways = options.gateways;

  return async (id, token) => {
    const requests = gateways.map(async gateway => gateway.execute(id, token));
    let notes = [].concat.apply([], await Promise.all(requests));
    notes = dedupe(notes, doc => JSON.stringify(doc));
    notes = notes.sort((a, b) => b.date - a.date);
    return { notes };
  };
};
