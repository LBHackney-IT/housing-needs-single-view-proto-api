module.exports = options => {
  const doGetDocRequest = options.doGetDocRequest;
  const login = options.login;
  return {
    execute: async id => {
      try {
        const url = `${process.env.JigsawHomelessnessBaseSearchUrl}/api/blobdownload/${id}`;
        const token = await login();

        const doc = await doGetDocRequest(url, {
          Authorization: `Bearer ${token}`
        });
        return doc;
      } catch (err) {
        console.log(`Error fetching the document: ${err}`);
      }
    }
  };
};
