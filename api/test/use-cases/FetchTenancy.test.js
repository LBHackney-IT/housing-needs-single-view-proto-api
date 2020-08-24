describe('FetchTenancy', () => {
  let fetchTenancyGateway;
  let fetchTenantsGateway;

  const dummyTenantsGatewayResponse = {
    tenants: [
      {
        title: 'Mrs',
        forename: 'Joan',
        surname: 'Fisher',
        dob: '1970-02-30',
        mobileNum: '07777123456',
        homeNum: '02088881234',
        workNum: '02012345678',
        email: 'mjf@email.com'
      }
    ]
  };

  const dummyTenancyGatewayResponse = {
    tenancy: {
      id: '123456/1',
      address: '12 Hill Street N16 5TT',
      type: 'Secure',
      startDate: '1992-06-13',
      dummyTenantsGatewayResponse
    }
  };
  beforeEach(() => {
    fetchTenancyGateway = {
      execute: jest.fn(() => dummyTenancyGatewayResponse)
    };

    fetchTenantsGateway = {
      execute: jest.fn(() => dummyTenantsGatewayResponse)
    };

    fetchTenancy = require('../../lib/use-cases/FetchTenancy')({
      fetchTenancyGateway,
      fetchTenantsGateway
    });
  });

  it('can fetch a tenancy from the Tenancy Gateway and return it', async () => {
    const id = 1;
    const token = 'abc';

    const result = await fetchTenancy(id, token);

    expect(fetchTenancyGateway.execute).toHaveBeenCalledWith(id, token);
    expect(result).toBe(dummyTenancyGatewayResponse);
  });

  it('can fetch tenants from the Tenants Gateway and return it', async () => {
    const id = 1;
    const token = 'abc';

    const result = await fetchTenancy(id, token);

    expect(fetchTenantsGateway.execute).toHaveBeenCalledWith(id, token);
    expect(result.tenants).toBe(dummyTenantsGatewayResponse);
  });
});
