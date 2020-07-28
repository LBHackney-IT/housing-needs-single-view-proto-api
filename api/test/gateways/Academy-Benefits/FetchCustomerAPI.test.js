const AcademyBenefitsFetchRecordAPI = require('../../../lib/gateways/Academy-Benefits/FetchCustomerAPI');
const nock = require('nock');

describe('AcademyBenefitsFetchRecord gateway', () => {
  let db;
  let logger;
  
  const createGateway = (customer, personRef, claimId) => {
    const baseUrl = 'https://test-domain.com';
    const apiKey = 'anbdabkd';
    const mockRequest =
      nock(baseUrl, {
        reqHeaders: {
          'X-API-Key': apiKey
        }
      }).get(`/api/v1/claim/${claimId}/person/${personRef}`)
        .reply(200, customer);

    logger = {
      error: jest.fn((msg, err) => { })
    };

    return AcademyBenefitsFetchRecordAPI({
      baseUrl,
      apiKey,
      logger
    });

  };

  it('queries the API with appropriate ids', async () => {
    const claimId = '5260765';
    const personRef = '12345'
    const customerData =
    {
      claimId: 5260765,
      checkDigit: '6',
      claimantAddress: {}
    }
    const gateway = createGateway(customerData, personRef, claimId);
    await gateway.execute(claimId, personRef);
    expect(nock.isDone()).toBe(true);
  });

  it('returns nicely formatted customer data', async () => {
    const claimId = '5260765';
    const personRef = '12345';
    const customerData =
    {
      claimId: 5260765,
      checkDigit: '6',
      title: 'Ms',
      firstName: 'Elwira',
      lastName: 'Moncur',
      dateOfBirth: new Date('1971-12-22T00:00:00.000Z'),
      niNumber: 'CD877332Z',
      claimantAddress: {
        addressLine1: '6 Cascade Junction',
        addressLine2: '49 Norway Maple Pass',
        addressLine3: 'LONDON',
        addressLine4: null,
        postcode: 'I3 0RP',
      },
      statusIndicator: 1
    };


    const gateway = createGateway(customerData, personRef, claimId);

    const record = await gateway.execute(claimId, personRef);
    expect(record).toEqual(
      expect.objectContaining({
        address: [
          {
            address: [
              '6 Cascade Junction',
              '49 Norway Maple Pass',
              'London',
              'I3 0RP'
            ],
            source: 'ACADEMY-Benefits'
          }
        ],
        name: [
          {
            first: 'Elwira',
            last: 'Moncur',
            title: 'Ms'
          }
        ],
        dob: ['1971-12-22 12:00:00'],
        nino: ['CD877332Z'],
        postcode: ['I3 0RP'],
        systemIds: {
          academyBenefits: ['52607656']
        },
        benefits: {
          live: true
        }
      })
    );
  });

});


