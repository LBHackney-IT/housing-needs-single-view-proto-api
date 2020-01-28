const { Systems } = require('../../Constants');
const {
  nameCase,
  formatAddress,
  formatDisplayDate,
  upperCase,
  dedupe
} = require('../../Utils');

module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const jigsawEnv = options.jigsawEnv;

  const searchUrl = `https://zebracustomers${jigsawEnv}.azurewebsites.net/api/customerSearch`;

  const runSearchQuery = async query => {
    const search = [query.firstName, query.lastName].filter(x => x).join(' ');
    return await doJigsawGetRequest(searchUrl, { search });
  };

  const processSearchResults = results => {
    if (results.length == 1 && results[0].id == 0) {
      return [];
    } else {
      return dedupe(results, x => x.id).map(record => {
        return {
          id: record.id.toString(),
          firstName: nameCase(record.firstName),
          lastName: nameCase(record.lastName),
          dob: formatDisplayDate(record.doB),
          nino: upperCase(record.niNumber),
          address: formatAddress(record.address).join(','),
          source: Systems.JIGSAW
        };
      });
    }
  };

  return async query => {
    try {
      const results = await runSearchQuery(query);
      return processSearchResults(results);
    } catch (err) {
      console.log(`Error searching customers in Jigsaw: ${err}`);
      return [];
    }
  };
};
