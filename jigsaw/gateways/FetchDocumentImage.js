module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  return {
    execute: async id => {
      try {
        const url = `https://zebrahomelessnessproduction.azurewebsites.net/api/blobdownload/${id}`;
        return await doJigsawGetRequest(url, {}, true);
      } catch (err) {
        console.log(`Error fetching jigsaw document: ${err}`);
      }
    }
  };
};
