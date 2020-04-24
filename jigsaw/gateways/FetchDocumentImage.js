module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  return {
    execute: async id => {
      try {
        const url = `${process.env.JigsawHomelessnessBaseSearchUrl}/api/blobdownload/${id}`;
        return await doJigsawGetRequest(url, {}, true);
      } catch (err) {
        console.log(`Error fetching jigsaw document: ${err}`);
      }
    }
  };
};
