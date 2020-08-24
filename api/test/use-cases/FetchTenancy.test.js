describe('FetchTenancy', () => {
  let fetchTenancy;
  let gateway;

  const dummyTenancyGatewayResponse = {
    tenancy: {
      id: '123456/1',
      address: '12 Hill Street N16 5TT',
      type: 'Secure',
      startDate: '1992-06-13',
      tenants: [
        {
          title: 'Mrs',
          forename: 'Joan',
          surname: 'Fisher',
          fullName: 'Mrs Joan Fisher',
          dob: '1970-02-30',
          mobileNum: '07777123456',
          homeNum: '02088881234',
          workNum: '02012345678',
          email: 'mjf@email.com'
        }
      ]
    }
  };
  beforeEach(() => {
    gateway = {
      execute: jest.fn(() => dummyTenancyGatewayResponse)
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
    expect(result).toBe(dummyTenancyGatewayResponse);
  });
});
