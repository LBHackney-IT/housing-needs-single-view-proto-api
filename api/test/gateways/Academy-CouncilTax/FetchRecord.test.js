const AcademyCouncilTaxFetchRecord = require('../../../lib/gateways/Academy-CouncilTax/FetchRecord');

describe('AcademyCouncilTaxFetchRecord gateway', () => {
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

    return AcademyCouncilTaxFetchRecord({
      db
    });
  };

  it('queries the database with appropriate id', async () => {
    const gateway = createGateway([]);
    const id = '27126442';
    const queryMatcher = expect.stringMatching(/account_ref = @account_ref/);
    const paramMatcher = expect.arrayContaining([
      {
        id: 'account_ref',
        type: 'NVarChar',
        value: '27126442'
      }
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });

  it('returns nicely formatted customer data', async () => {
    const id = '5260765/1';

    const customerData = [
      {
        account_ref: 27126442,
        account_cd: '1',
        lead_liab_title: 'Ms',
        lead_liab_forename: 'Elwira',
        lead_liab_surname: 'Moncur',
        for_addr1: '8017 Garrison Point',
        for_addr2: '2',
        for_addr3: 'Lake View Crossing',
        for_addr4: 'LONDON',
        for_postcode: 'S3 1EV',
        addr1: '0 Claremont Alley',
        addr2: '6906 Northwestern Avenue',
        addr3: 'LONDON',
        addr4: null,
        postcode: 'I0 5XL',
        account_balance: 5,
        payment_method: 'Future-proofed motivating workforce',
        hb_claim_id: 5260765
      },
      [
        {
          date: new Date('2019-04-01T00:00:00.000Z'),
          amount: 33.77,
          description: 'description 1'
        },
        {
          date: new Date('2019-04-01T00:00:00.000Z'),
          amount: 33.77,
          description: 'description 3'
        },
        {
          date: new Date('2019-04-01T00:00:00.000Z'),
          amount: 33.77,
          description: 'description 5'
        },
        {
          date: new Date('2019-04-01T00:00:00.000Z'),
          amount: 33.77,
          description: 'description 8'
        },
        {
          date: new Date('2019-04-01T00:00:00.000Z'),
          amount: 33.77,
          description: 'description 0'
        }
      ]
    ];
    const gateway = createGateway(customerData);

    const record = await gateway.execute(id);
    expect(record).toEqual({
      address: [
        {
          address: [
            '0 Claremont Alley',
            '6906 Northwestern Avenue',
            'London',
            'I0 5XL'
          ],
          source: 'ACADEMY-CouncilTax-Property'
        },
        {
          address: [
            '8017 Garrison Point',
            '2',
            'Lake View Crossing',
            'London',
            'S3 1EV'
          ],
          source: 'ACADEMY-CouncilTax-Forwarding-Address'
        }
      ],
      councilTax: {
        accountBalance: 5,
        paymentMethod: 'Future-proofed motivating workforce',
        transactions: [
          {
            account_balance: 5,
            account_cd: '1',
            account_ref: 27126442,
            addr1: '0 Claremont Alley',
            addr2: '6906 Northwestern Avenue',
            addr3: 'LONDON',
            addr4: null,
            for_addr1: '8017 Garrison Point',
            for_addr2: '2',
            for_addr3: 'Lake View Crossing',
            for_addr4: 'LONDON',
            for_postcode: 'S3 1EV',
            hb_claim_id: 5260765,
            lead_liab_forename: 'Elwira',
            lead_liab_surname: 'Moncur',
            lead_liab_title: 'Ms',
            payment_method: 'Future-proofed motivating workforce',
            postcode: 'I0 5XL'
          },
          [
            {
              amount: 33.77,
              date: new Date('2019-04-01T00:00:00.000Z'),
              description: 'description 1'
            },
            {
              amount: 33.77,
              date: new Date('2019-04-01T00:00:00.000Z'),
              description: 'description 3'
            },
            {
              amount: 33.77,
              date: new Date('2019-04-01T00:00:00.000Z'),
              description: 'description 5'
            },
            {
              amount: 33.77,
              date: new Date('2019-04-01T00:00:00.000Z'),
              description: 'description 8'
            },
            {
              amount: 33.77,
              date: new Date('2019-04-01T00:00:00.000Z'),
              description: 'description 0'
            }
          ]
        ]
      },
      name: [{ first: 'Elwira', last: 'Moncur', title: 'Ms' }],
      postcode: ['S3 1EV'],
      systemIds: { academyCouncilTax: ['271264421'] }
    });
  });

  it('catches and console logs errors', async () => {
    let consoleOutput = '';
    const storeLog = inputs => (consoleOutput += inputs);
    console['log'] = jest.fn(storeLog);

    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(consoleOutput).toBe(
      'Error fetching customers in Academy-CouncilTax: Error: Database error'
    );
  });
});
