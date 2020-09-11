describe('FetchTenancy', () => {
  let fetchTenancyGateway;
  let matServiceFetchContactsGateway;
  let dummyContactsGatewayResponse;
  let dummyTenancyGatewayResponse;

  beforeEach(() => {
    dummyTenancyGatewayResponse = {
      id: '123456/1',
      address: '12 Hill Street N16 5TT',
      type: 'Secure',
      startDate: '1992-06-13',
      uprn: '123456'
    };
    dummyContactsGatewayResponse = [
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
    ];
    fetchTenancyGateway = {
      execute: jest.fn(() => dummyTenancyGatewayResponse)
    };

    matServiceFetchContactsGateway = {
      execute: jest.fn(() => dummyContactsGatewayResponse)
    };

    fetchTenancy = require('../../lib/use-cases/FetchTenancy')({
      fetchTenancyGateway,
      matServiceFetchContactsGateway
    });
  });

  it('can fetch a tenancy from the Tenancy Gateway and return it', async () => {
    const id = 1;
    const token = 'abc';

    const result = await fetchTenancy(id, token);

    expect(fetchTenancyGateway.execute).toHaveBeenCalledWith(id, token);
    expect(result).toBe(dummyTenancyGatewayResponse);
  });

  it('can fetch contacts from the MaT Service API Gateway and return them', async () => {
    const id = 1;
    const token = 'abc';

    const result = await fetchTenancy(id, token);

    expect(matServiceFetchContactsGateway.execute).toHaveBeenCalledWith(
      dummyTenancyGatewayResponse.uprn
    );
    expect(result.contacts).toBe(dummyContactsGatewayResponse);
  });
});
