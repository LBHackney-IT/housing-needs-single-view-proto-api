const { dedupe } = require('@lib/Utils');
const { Systems } = require('@lib/Constants');

module.exports = options => {
  const buildSearchRecord = options.buildSearchRecord;
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const jigsawEnv = options.jigsawEnv;

  const searchUrl = `https://zebracustomers${jigsawEnv}.azurewebsites.net/api/customerSearch`;

  const search = async query => {
    const search = [query.firstName, query.lastName].filter(x => x).join(' ');
    return await doJigsawGetRequest(searchUrl, { search });
  };

  const validateIds = record => {
    return record.id;
  };

  const processRecords = records => {
    if (records.length === 1 && records[0].id === 0) {
      return [];
    } else {
      return dedupe(records, x => x.id)
        .filter(record => validateIds(record))
        .map(record => {
          return buildSearchRecord({
            id: record.id.toString(),
            firstName: record.firstName,
            lastName: record.lastName,
            dob: record.doB,
            nino: record.niNumber,
            address: record.address,
            source: Systems.JIGSAW
          });
        });
    }
  };

  return {
    execute: async queryParams => {
      try {
        const results = await search(queryParams);
        return processRecords(results);
      } catch (err) {
        console.log(`Error searching customers in Jigsaw: ${err}`);
        return [];
      }
    }
  };
};
