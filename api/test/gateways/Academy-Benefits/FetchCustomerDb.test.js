const AcademyBenefitsFetchRecord = require('../../../lib/gateways/Academy-Benefits/FetchCustomerDB');

describe('AcademyBenefitsFetchRecord gateway', () => {
  let db;
  let logger;
  const dbError = new Error('Database error');
  const createGateway = (customer = [{}]) => {
    db = {
      request: jest.fn(async () => {
        return customer;
      })
    };

    logger = {
      error: jest.fn((msg, err) => { })
    };

    return AcademyBenefitsFetchRecord({
      db,
      logger
    });
  };

  it('queries the database with appropriate id', async () => {
    const claimId = '5260765';
    const personRef = '12345';
    const gateway = createGateway();
    const queryMatcherClaimId = expect.stringMatching(/claim_id = @claim_id/);
    const queryMatcherPersonRef = expect.stringMatching(/person_ref = @person_ref/);

    const paramMatcher = expect.arrayContaining([
      {
        id: 'claim_id',
        type: 'NVarChar',
        value: '5260765'
      },
      {
        id: 'person_ref',
        type: 'Int',
        value: '12345'
      }
    ]);

    await gateway.execute(claimId, personRef);
    expect(db.request).toHaveBeenCalledWith(queryMatcherPersonRef, paramMatcher);
    expect(db.request).toHaveBeenCalledWith(queryMatcherClaimId, paramMatcher);
  });

  it('return nicely formatted customer data', async () => {

    const claimId = '5260765';
    const personRef = '12345';
    const customerData = [
      {
        claim_id: 5260765,
        check_digit: '6',
        title: 'Ms',
        forename: 'Elwira',
        surname: 'Moncur',
        birth_date: new Date('1971-12-22T00:00:00.000Z'),
        nino: 'CD877332Z',
        addr1: '6 Cascade Junction',
        addr2: '49 Norway Maple Pass',
        addr3: 'LONDON',
        addr4: null,
        post_code: 'I3 0RP',
        status_ind: 1
      }

    ];
    const gateway = createGateway(customerData);

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
