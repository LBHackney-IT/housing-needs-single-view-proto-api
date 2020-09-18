const FetchAreaPatch = require('../../../lib/gateways/MaT-Service-API/FetchAreaPatch');
const nock = require('nock');

describe('MaT-Service-API FetchAreaPatch gateway', () => {
  const uprn = '12345678901';
  const postcode = 'A1RTY';
  const data = {
    patch: {
      patchCode: 'some patch code',
      areaName: 'some area',
      ward: 'some ward',
      officerFullName: 'officer name'
    }
  };

  const createGateway = (response, uprn, postcode) => {
    const baseUrl = 'https://test-domain.com';
    const apiToken = 'anbdabkd';

    nock(baseUrl, {
      reqheaders: {
        Authorization: `Bearer ${apiToken}`
      }
    })
      .get(`/api/properties/${uprn}/patch?${postcode}`)
      .reply(200, response);

    return FetchAreaPatch({
      baseUrl,
      apiToken
    });
  };

  it('queries the API with appropriate parameters', async () => {
    const gateway = createGateway(data, uprn, postcode);
    await gateway.execute(uprn, postcode);
    expect(nock.isDone()).toBe(true);
  });

  it('returns the data from the API', async () => {
    const gateway = createGateway(data, uprn, postcode);

    const response = await gateway.execute(uprn, postcode);
    expect(response).toEqual(data);
  });
});
