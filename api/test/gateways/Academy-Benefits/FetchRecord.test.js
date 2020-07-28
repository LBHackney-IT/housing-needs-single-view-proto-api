const AcademyBenefitsFetchRecord = require('../../../lib/gateways/Academy-Benefits/FetchRecord');

describe('AcademyBenefitsFetchRecord gateway', () => {
  let  logger, fetchDB, fetchAPI;
  const dbError = new Error('Database error');
  const apiError = new Error('API Error');
  const randomRecord1 = () => ({
    claim_id: '12345',
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
    benefits: [{
      live: true
    }]
  })
  const randomRecord2 = {
    claim_id: '12435',
    address: [
      {
        address: [
          '7 Cascade Junction',
          '46 Norway Maple Pass',
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
        title: 'Mrs'
      }
    ],
    nino: ['CD877332Z'],
    postcode: ['I3 0RP'],
    systemIds: {
      academyBenefits: ['53607656']
    },
    benefits: [{
      live: true
    }]
  }
  const createGateway = ({
    dbCustomer = {},
    apiCustomer = {},
    throwsApiError = false,
    throwsFetchCustomerDbError = false,
    throwsDbError = false,
    dbRecords = [] 
  }) => {
    db = {
      request: jest.fn(async () => {
        if (throwsDbError) {
          throw dbError;
        }
        return dbRecords;
      })
    }

    fetchDB = {
      execute: jest.fn(async () => {
        if (throwsFetchCustomerDbError) throw dbError;
        return dbCustomer;
      })
    };

    fetchAPI = {
      execute: jest.fn(async () => {
        if (throwsApiError) throw apiError;
        return apiCustomer;
      })
    };

    logger = {
      error: jest.fn((msg, err) => { }),
      log: jest.fn()
    };

    return AcademyBenefitsFetchRecord({
      db,
      logger,
      fetchDB,
      fetchAPI
    });
  };

  it('calls the fetch DB function with given ids', async () => {
    const claimId = '54321';
    const personRef = '12345';
    const gateway = createGateway({});

    await gateway.execute('54321/12345');

    expect(fetchDB.execute).toHaveBeenCalledWith(claimId, personRef);
  });

  it('calls the fetch API function with given ids', async () => {
    const claimId = '54321';
    const personRef = '12345';
    const gateway = createGateway({});

    await gateway.execute('54321/12345');

    expect(fetchAPI.execute).toHaveBeenCalledWith(claimId, personRef);
  });

  it('Calls the logger if there is an error fetching customer from db gateway', async () => {
    const record = randomRecord1;
    const gateway = createGateway({ dbCustomer: record, throwsFetchCustomerDbError: true });

    await gateway.execute('2476');

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching customers in Academy-Benefits: Error: Database error',
      dbError
    );
  });

  it('calls logger if the API throws an error but still returns records from DB', async () => {
    const record = randomRecord1();
    const gateway = createGateway({ dbCustomer: record, throwsApiError: true });
    const claimId = '12345'
    const records = await gateway.execute(claimId);
    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching customers in Academy-Benefits API: Error: API Error',
      apiError
    );

    expect(records.claim_id).toBe(claimId);
  });

  it('logs if the API and DB return the same record', async () => {
    const record = {...randomRecord1()};
    const record1 = {...randomRecord1()};
    const gateway = createGateway({ dbCustomer: record, apiCustomer: record1 });

    await gateway.execute('67890');
    expect(logger.log).toHaveBeenCalledWith("Academy records retrieved from the API and the DB are identical");
  });

  it('logs if the API and DB return different records and returns the DB records', async () => {
    const dbRecord = randomRecord1();
    const apiRecord = randomRecord2;
    const gateway = createGateway({ dbCustomer: dbRecord, apiCustomer: apiRecord });

    const response = await gateway.execute(dbRecord.claim_id);

    expect(logger.log).toHaveBeenCalledWith("Academy API and DB have returned different record")
    expect(logger.log).toHaveBeenCalledWith({ "DB record": dbRecord })
    expect(logger.log).toHaveBeenCalledWith({ "API record": apiRecord })
    expect(response.claim_id).toBe(dbRecord.claim_id)
  });

  it("ignore case and whitespace when checking equality", async() => {
    const record = {...randomRecord1()};
    const record1 = {...randomRecord1()};
    record1.postcode[0] = 'i3 0rp   ';
    record1.name[0].last = 'MONCUR  ';
    const gateway = createGateway({ dbCustomer: record, apiCustomer: record1 });

    await gateway.execute('67890');
    expect(logger.log).toHaveBeenCalledWith("Academy records retrieved from the API and the DB are identical");
  })

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

    const benefitsData = [
      {
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
    const customer = {
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
    }

    const gateway = createGateway({ dbRecords: benefitsData, dbCustomer: customer });

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

  it('catches and calls logger', async () => {
    const gateway = createGateway({ throwsDbError: true });

    await gateway.execute('id');
    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching customers in Academy-Benefits: Error: Database error',
      dbError
    );
  });
});
