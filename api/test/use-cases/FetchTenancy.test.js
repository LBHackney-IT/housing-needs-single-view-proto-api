describe('FetchTenancy', () => {
  const dummyTenancyGatewayResponse = {
    id: '123456/1',
    address: '12 Hill Street N16 5TT',
    type: 'Secure',
    startDate: '1992-06-13',
    uprn: '123456'
  };
  const dummyContactsGatewayResponse = [
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
  const dummyTenantsGatewayResponse = [
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
  const fetchTenancyGateway = {
    execute: jest.fn(() => dummyTenancyGatewayResponse)
  };
  const fetchTenantsGateway = {
    execute: jest.fn(() => dummyTenantsGatewayResponse)
  };

  const matServiceFetchContactsGateway = {
    execute: jest.fn(() => dummyContactsGatewayResponse)
  };
  const matServiceFetchTasksGateway = {
    execute: jest.fn(() => dummyContactsGatewayResponse)
  };

  const fetchTenancy = require('../../lib/use-cases/FetchTenancy')({
    fetchTenancyGateway,
    matServiceFetchContactsGateway,
    fetchTenantsGateway,
    matServiceFetchTasksGateway
  });

  const mergedResponse = [
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
