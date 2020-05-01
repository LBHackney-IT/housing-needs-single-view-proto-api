const UHTContactsFetchRecord = require('../../../lib/gateways/UHT-Contacts/FetchRecord');

describe('UHTContactsFetchRecord gateway', () => {
  let db;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (customer, throwsError) => {
    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return customer;
      })
    };

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return UHTContactsFetchRecord({
      db,
      logger
    });
  };

  it('queries the database with appropriate id', async () => {
    const gateway = createGateway([]);
    const id = '4/1';
    const house_refQueryMatcher = expect.stringMatching(
      /house_ref = @house_ref/
    );
    const person_noQueryMatcher = expect.stringMatching(
      /person_no = @person_no/
    );
    const paramMatcher = expect.arrayContaining([
      {
        id: 'house_ref',
        type: 'NVarChar',
        value: '4'
      }
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(
      house_refQueryMatcher,
      paramMatcher
    );
    expect(db.request).toHaveBeenCalledWith(
      person_noQueryMatcher,
      paramMatcher
    );
  });

  it('returns nicely formatted customer data', async () => {
    const id = '4/1';

    const customer = {
      member_sid: 222222,
      title: 'Ms        ',
      forename: 'Elwira                  ',
      surname: 'Moncur              ',
      dob: '19711222',
      ni_no: 'CD877332Z   ',
      house_ref: '6867133   ',
      address:
        '1 Mallard Circle                                                                                                                                                                                        ',
      postcode: 'N1 5DZ    ',
      con_key: 7250,
      con_phone1: '07222222222          ',
      con_phone2: '07123456789          ',
      con_phone3: '02222222222          ',
      tag_ref: '000038/08  ',
      u_saff_rentacc: '593507764           ',
      start_date: new Date('2005-11-08T00:00:00.000Z'),
      end_date: new Date('2018-03-21T00:00:00.000Z'),
      tenure: 'FactSet Res    ',
      current_balance: -669.98,
      rent: 0,
      prop_ref: '579165050   ',
      post_preamble:
        '7433 Armistice Pass                                         ',
      aline1: '07777 Claremont Terrace                           ',
      aline2: 'Hackney                                           ',
      aline3: 'LONDON                                            ',
      aline4: null,
      post_code: 'DV9 17V   ',
      rent_period: 'Monthly(3th)    '
    };

    const gateway = createGateway([customer]);

    const record = await gateway.execute(id);
    expect(record).toEqual(
      expect.objectContaining({
        address: [
          {
            address: ['1 Mallard Circle'],
            source: 'UHT-Contacts'
          }
        ],
        dob: ['1971-12-22 12:00:00'],
        name: [
          {
            first: 'Elwira',
            last: 'Moncur',
            title: 'Ms'
          }
        ],
        nino: ['CD877332Z'],
        phone: ['07222222222', '07123456789', '02222222222'],
        postcode: ['N1 5DZ'],
        systemIds: {
          householdRef: '6867133   ',
          paymentRef: '593507764           ',
          rent: '000038/08',
          uhtContacts: '222222'
        },
        tenancies: [
          expect.objectContaining({
            address: [
              '7433 Armistice Pass',
              '07777 Claremont Terrace',
              'Hackney',
              'London',
              'Dv9 17v'
            ],
            currentBalance: -669.98,
            propRef: '579165050',
            rentAmount: 0,
            tagRef: '000038/08',
            tenure: 'FactSet Res'
          })
        ]
      })
    );
  });

  it('catches and calls logger', async () => {
    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching customers in UHT-Contacts: Error: Database error',
      dbError
    );
  });
});
