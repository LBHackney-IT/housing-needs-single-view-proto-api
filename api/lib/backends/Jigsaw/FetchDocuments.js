const { Systems } = require('@lib/Constants');
const { formatRecordDate } = require('@lib/Utils');

module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const doJigsawPostRequest = options.doJigsawPostRequest;
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

  const processDocumentsResults = results => {
    return results
      .map(r => {
        return r.caseDocuments.map(doc => {
          return {
            title: 'Document',
            text: doc.name,
            date: formatRecordDate(doc.date),
            user: doc.casePersonName,
            system: Systems.JIGSAW
          };
        });
      })
      .flat();
  };

  return async id => {
    try {
      const result = await fetchCustomerDocuments(id);
      return processDocumentsResults(result);
    } catch (err) {
      `Error fetching customer documents in Jigsaw: ${err}`;
    }
  };
};
