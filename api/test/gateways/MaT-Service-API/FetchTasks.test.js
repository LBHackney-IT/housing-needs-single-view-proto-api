const FetchTasks = require('../../../lib/gateways/MaT-Service-API/FetchTasks');
const nock = require('nock');

describe('MaT-Service-API FetchTasks gateway', () => {
  const tag_ref = '123456';
  const data = { tasks: [{ task: 1 }] };

  const createGateway = (response, tag_ref) => {
    const baseUrl = 'https://test-domain.com';
    const apiToken = 'anbdabkd';

    nock(baseUrl, {
      reqheaders: {
        cookie: `hackneyToken=${apiToken}`
      }
    })
      .get(`/api/tasks?tag_ref=${tag_ref}`)
      .reply(200, response);

    return FetchTasks({
      baseUrl,
      apiToken
    });
  };

  it('queries the API with appropriate ids', async () => {
    const gateway = createGateway(data, tag_ref);
    await gateway.execute(tag_ref);
    expect(nock.isDone()).toBe(true);
  });

  it('returns the data from the API', async () => {
    const gateway = createGateway(data, tag_ref);

    const response = await gateway.execute(tag_ref);
    expect({ tasks: response }).toEqual(data);
  });
});
