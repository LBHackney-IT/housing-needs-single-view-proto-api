module.exports = options => {
  const cominoFetchNotesGateway = options.cominoFetchNotesGateway;
  const logger = options.logger;

  return {
    execute: async id => {
      try {
        if (id) {
          const comino_results = await cominoFetchNotesGateway.execute({
            account_ref: id
          });
          return comino_results;
        }
        return [];
      } catch (err) {
        logger.error(`Error fetching customer notes in Comino: ${err}`, err);
        return [];
      }
    }
  };
};
