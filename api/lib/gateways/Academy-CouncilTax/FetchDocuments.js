const { Systems } = require('../../Constants');

module.exports = options => {
  const cominoFetchDocumentsGateway = options.cominoFetchDocumentsGateway;
  const getSystemId = options.getSystemId;

  const fetchSystemId = async id => {
    const systemId = await getSystemId.execute(Systems.ACADEMY_COUNCIL_TAX, id);
    if (systemId) return systemId;
  };

  return {
    execute: async id => {
      try {
        const account_ref = await fetchSystemId(id);
        if (account_ref) {
          const comino_results = await cominoFetchDocumentsGateway.execute({
            account_ref
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
