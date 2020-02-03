const { Systems } = require('../../Constants');

module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const doJigsawPostRequest = options.doJigsawPostRequest;
  const buildDocument = options.buildDocument;
  const jigsawEnv = options.jigsawEnv;

  const caseUrl = `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/casecheck/`;
  const docsUrl = `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/cases/getcasedocs/`;

  const fetchCases = async id => {
    return await doJigsawGetRequest(caseUrl + id);
  };

  const fetchCustomerDocuments = async id => {
    const casesResult = await fetchCases(id);

    const requests = casesResult.cases.map(c => {
      return doJigsawPostRequest(docsUrl + c.id, {});
    });

    return [].concat.apply([], await Promise.all(requests));
  };

  const processDocuments = records => {
    return records
      .map(doc => {
        return buildDocument({
          title: 'Document',
          text: doc.name,
          date: doc.date,
          user: doc.casePersonName,
          system: Systems.JIGSAW
        });
      })
      .flat();
  };

  return {
    execute: async id => {
      try {
        const result = await fetchCustomerDocuments(id);
        return processDocuments(result);
      } catch (err) {
        `Error fetching customer documents in Jigsaw: ${err}`;
        return [];
      }
    }
  };
};
