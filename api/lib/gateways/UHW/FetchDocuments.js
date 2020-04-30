module.exports = options => {
  const { buildDocument, fetchW2Documents, Logger } = options;

  return {
    execute: async (id, token) => {
      if (!id) return [];

      try {
        const cominoRecords = await fetchW2Documents(
          { id, gateway: 'uhw' },
          token
        );

        return cominoRecords.map(doc => buildDocument(doc));
      } catch (e) {
        Logger.error(`Error fetching documents from UHW: ${e}`, e);
        return [];
      }
    }
  };
};
