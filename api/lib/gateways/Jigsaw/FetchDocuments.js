const { Systems } = require('../../Constants');
const { formatRecordDate } = require('../../Utils');

module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const doJigsawPostRequest = options.doJigsawPostRequest;
  const buildDocument = options.buildDocument;

  const caseUrl = `https://zebrahomelessnessproduction.azurewebsites.net/api/casecheck/`;
  const docsUrl = `https://zebrahomelessnessproduction.azurewebsites.net/api/cases/getcasedocs/`;

  const fetchCases = async id => {
    return await doJigsawGetRequest(caseUrl + id);
  };

  const fetchCustomerDocuments = async id => {
    const casesResult = await fetchCases(id);

    const requests = casesResult.cases.map(c => {
      return doJigsawPostRequest(docsUrl + c.id, {});
    });

    return [].concat
      .apply([], await Promise.all(requests))
      .map(x => x.caseDocuments)
      .flat();
  };

  const processDocuments = documents => {
    return documents.map(doc => {
      return buildDocument({
        id: doc.id,
        title: 'Document',
        text: doc.name,
        date: formatRecordDate(doc.date),
        user: doc.casePersonName,
        system: Systems.JIGSAW
      });
    });
  };

  return {
    execute: async id => {
      try {
        if (id) {
          const documents = await fetchCustomerDocuments(id);
          return processDocuments(documents);
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer documents in Jigsaw: ${err}`);
        return [];
      }
    }
  };
};
