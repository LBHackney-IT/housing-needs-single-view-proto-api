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
        firstName: 'Joan',
        lastName: 'Fisher',
        dateOfBirth: '1970-02-30',
        mobileNum: '07777123456',
        homeNum: '02088881234',
        workNum: '02012345678',
        emailAddress: 'mjf@email.com'
      }
    ];
    dummyTenantsGatewayResponse = [
      {
        personNo: 1,
        responsible: true,
        relationship: 'relationship',
        title: 'Mrs',
        firstName: 'Joan',
        lastName: 'Fisher',
        dateOfBirth: '1970-02-30',
        telephone1: '07777123456',
        telephone2: '02088881234',
        telephone3: '02012345678',
        emailAddress: 'mjf@email.com'
      }
    ];
    fetchTenancyGateway = {
      execute: jest.fn(() => dummyTenancyGatewayResponse)
    };
    fetchTenantsGateway = {
      execute: jest.fn(() => dummyTenantsGatewayResponse)
    };

    matServiceFetchContactsGateway = {
      execute: jest.fn(() => dummyContactsGatewayResponse)
    };

    fetchTenancy = require('../../lib/use-cases/FetchTenancy')({
      fetchTenancyGateway,
      matServiceFetchContactsGateway,
      fetchTenantsGateway
    });

    mergedResponse = [
      {
        personNo: 1,
        relationship: 'relationship',
        responsible: true,
        title: 'Mrs',
        firstName: 'Joan',
        lastName: 'Fisher',
        dateOfBirth: '1970-02-30',
        telephone1: '07777123456',
        telephone2: '02088881234',
        telephone3: '02012345678',
        emailAddress: 'mjf@email.com'
      }
    ];
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
    expect(result.contacts).toStrictEqual(mergedResponse);
  });
});
