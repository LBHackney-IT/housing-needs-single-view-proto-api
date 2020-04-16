module.exports = options => {
  const { buildDocument, fetchW2Documents } = options;

  return {
    execute: async (id, token) => {
      if (!id) return [];

      try {
        const cominoRecords = await fetchW2Documents(
          { id, gateway: 'hncomino' },
          token
        );

        return cominoRecords.map(doc => buildDocument(doc));
      } catch (err) {
        console.log(`Error fetching customer documents in Comino: ${err}`);
        return [];
      }
    }
  };
};
