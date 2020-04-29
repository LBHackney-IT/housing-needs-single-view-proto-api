const AcademyBenefitsFetchRecord = require('../../../lib/gateways/Academy-Benefits/FetchRecord');

describe('AcademyBenefitsFetchRecord gateway', () => {
  let db;

  const createGateway = (customer, throwsError) => {
    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return customer;
      })
    };

    return AcademyBenefitsFetchRecord({
      db
    });
  };

  it('queries the database with appropriate id', async () => {
    const gateway = createGateway([]);
    const id = '5260765/1';
    const queryMatcher = expect.stringMatching(/claim_id = @claim_id/);
    const paramMatcher = expect.arrayContaining([
      {
        id: 'claim_id',
        type: 'NVarChar',
        value: '5260765'
      }
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('returns nicely formatted customer data', async () => {
    const id = '5260765/1';

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
        status_ind: 1,
        amount: 102.02,
        freq_len: 2,
        freq_period: 1,
        description: 'Magic Blabla'
      },
      {
        amount: 89.56,
        freq_len: 2,
        freq_period: 1,
        description: 'Future-proofed motivating workforce'
      },
      {
        amount: 89.56,
        freq_len: 2,
        freq_period: 1,
        description: 'Virtual encompassing internet solution'
      },
      {
        amount: 89.56,
        freq_len: 2,
        freq_period: 1,
        description: 'Multi-lateral tertiary extranet'
      },
      {
        amount: 89.56,
        freq_len: 2,
        freq_period: 1,
        description: 'Advanced clear-thinking algorithm'
      }
    ];
    const gateway = createGateway(customerData);

    const record = await gateway.execute(id);
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
          income: [
            {
              amount: 102.02,
              description: 'Magic Blabla',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Future-proofed motivating workforce',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Virtual encompassing internet solution',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Multi-lateral tertiary extranet',
              frequency: 1,
              period: 'Weekly'
            },
            {
              amount: 89.56,
              description: 'Advanced clear-thinking algorithm',
              frequency: 1,
              period: 'Weekly'
            }
          ],
          live: true
        }
      })
    );
  });

  it('catches and console logs errors', async () => {
    let consoleOutput = '';
    const storeLog = inputs => (consoleOutput += inputs);
    console['log'] = jest.fn(storeLog);

    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(consoleOutput).toBe(
      'Error fetching customers in Academy-Benefits: Error: Database error'
    );
  });
});
