module.exports = options => {
  const cominoFetchNotesGateway = options.cominoFetchNotesGateway;

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
        console.log(`Error fetching customer notes in Comino: ${err}`);
        return [];
      }
    }
  };
};
