module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const doJigsawPostRequest = options.doJigsawPostRequest;

  const caseUrl = `${process.env.JigsawHomelessnessBaseSearchUrl}/api/casecheck/`;
  const docsUrl = `${process.env.JigsawHomelessnessBaseSearchUrl}/api/cases/getcasedocs/`;

  const fetchMetadata = async jigsawId => {
    const casesResult = await doJigsawGetRequest(caseUrl + jigsawId);
    const requests = casesResult.cases.map(c => {
      return doJigsawPostRequest(docsUrl + c.id, {});
    });

    return [].concat
      .apply([], await Promise.all(requests))
      .map(x => x.caseDocuments)
      .flat();
  };

  return {
    execute: async id => {
      try {
        return await fetchMetadata(id);
      } catch (err) {
        console.log(`Error fetching jigsaw document metadata: ${err}`);
      }
    }
  };
};
