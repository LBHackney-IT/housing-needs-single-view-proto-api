const FetchContacts = require('../../../lib/gateways/MaT-Service-API/FetchContacts');
const nock = require('nock');

describe('MaT-Service-API FetchContacts gateway', () => {
  const createGateway = (response, uprn) => {
    const baseUrl = 'https://test-domain.com';
    const apiToken = 'anbdabkd';

    nock(baseUrl, {
      reqheaders: {
        Authorization: `Bearer ${apiToken}`
      }
    })
      .get(`/api/contacts?uprn=${uprn}`)
      .reply(200, response);

    return FetchContacts({
      baseUrl,
      apiToken
    });
  };

  it('queries the API with appropriate ids', async () => {
    const uprn = '12345678901';
    const gateway = createGateway(null, uprn);
    await gateway.execute(uprn);
    expect(nock.isDone()).toBe(true);
  });

  it('returns the data from the API', async () => {
    const uprn = '12345678901';
    const data = 'dummyData';

    const gateway = createGateway(data, uprn);

    const response = await gateway.execute(uprn);
    expect(response).toEqual(data);
  });
});
