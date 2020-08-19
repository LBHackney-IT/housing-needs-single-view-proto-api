describe('FetchTenancy', () => {
  let fetchTenancy;
  let gateway;

  const dummyGatewayResponse = {
    id: 'foo'
  };

  beforeEach(() => {
    gateway = {
      execute: jest.fn(() => dummyGatewayResponse)
    };

    fetchTenancy = require('../../lib/use-cases/FetchTenancy')({
      gateway
    });
  });

  it('can fetch a tenancy from the gateway and return it', async () => {
    const id = 1;
    const token = 'abc';

    const result = await fetchTenancy(id, token);

    expect(gateway.execute).toHaveBeenCalledWith(id, token);
    expect(result).toBe(dummyGatewayResponse);
  });
});
