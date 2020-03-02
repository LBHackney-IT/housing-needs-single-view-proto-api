const { Systems } = require('../../Constants');

module.exports = options => {
  const cominoFetchDocumentsGateway = options.cominoFetchDocumentsGateway;

  return {
    execute: async id => {
      try {
        if (id) {
          const comino_results = await cominoFetchDocumentsGateway.execute({
            id
          });
          return comino_results;
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer documents in Comino: ${err}`);
        return [];
      }
    }
  };
};
