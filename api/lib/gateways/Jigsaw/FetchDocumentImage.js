module.exports = options => {
  const doGetDocRequest = options.doGetDocRequest;
  const login = options.login;
  return {
    execute: async id => {
      const url = `https://zebrahomelessnessproduction.azurewebsites.net/api/blobdownload/${id}`;
      const token = await login();

      const doc = await doGetDocRequest(url, null, {
        Authorization: `Bearer ${token}`
      });
      return doc;
    }
  };
};
