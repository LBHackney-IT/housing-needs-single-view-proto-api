const request = require('request-promise');

const fetchCominoDocuments = async (params = {}, token) => {
  const { id, gateway } = params;

  const requestOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    resolveWithFullResponse: true,
    uri: `${process.env.W2_DOCUMENTS_API}/${gateway}/customers/${id}/documents`
  };

  const httpResponse = await request.get(requestOptions);

  return JSON.parse(httpResponse.body);
};

module.exports = { fetchCominoDocuments };
