const rp = require('request-promise');

module.exports = options => {
  const baseUrl = options.baseUrl;
  const apiToken = options.apiToken;

  return {
    execute: async tag_ref => {
      return await rp(`${baseUrl}/api/tasks?tag_ref=${tag_ref}`, {
        method: 'GET',
        headers: {
          Cookie: `hackneyToken=${apiToken}`
        },
        json: true
      }).then(response => {
        return response.tasks;
      });
    }
  };
};
