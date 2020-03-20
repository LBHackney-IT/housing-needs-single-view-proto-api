module.exports = options => {
  return {
    execute: async id => {
      const url = `https://zebrahomelessnessproduction.azurewebsites.net/api/blobdownload/${id}`;
      const { login } = require('../../JigsawUtils');
      const token = await login();

      const options = {
        url,
        headers: {
          Authorization: `Bearer ${token}`
        },
        encoding: null
      };
      const doc = await request.get(options);
      return doc;
    }
  };
};
