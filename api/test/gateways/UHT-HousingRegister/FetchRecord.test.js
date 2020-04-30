const UHTHousingRegisterFetchRecord = require('../../../lib/gateways/UHT-HousingRegister/FetchRecord');

describe('UHTHousingRegisterFetchRecord gateway', () => {
  let db;
  let Logger;
  const dbError = new Error('Database error');

  const createGateway = (customer, throwsError) => {
    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw dbError;
        }
        return customer;
      })
    };

    Logger = {
      error: jest.fn( (msg, err) => {})
    };

    return UHTHousingRegisterFetchRecord({
      db, Logger
    });
  };

  it('queries the database with appropriate id', async () => {
    const gateway = createGateway([]);
    const id = '4/1';
    const app_refQueryMatcher = expect.stringMatching(/app_ref = @app_ref/);
    const person_noQueryMatcher = expect.stringMatching(
      /person_no = @person_no/
    );
    const paramMatcher = expect.arrayContaining([
      {
        id: 'app_ref',
        type: 'NVarChar',
        value: '4'
      }
    ]);

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(app_refQueryMatcher, paramMatcher);
    expect(db.request).toHaveBeenCalledWith(
      person_noQueryMatcher,
      paramMatcher
    );
  });

  it('returns nicely formatted customer data', async () => {
    const id = 'DIR6940111/4';

    const customer = {
      app_ref: 'DIR6940111',
      person_no: 4,
      dob: new Date('1965-03-25T00:00:00.000Z'),
      forename: 'Hillel                  ',
      surname: 'Lorenz              ',
      ni_no: 'AB106755C   ',
      title: 'Mr        ',
      home_phone: '                    ',
      work_phone: '                    ',
      u_memmobile: '                    ',
      m_address:
        '                                                                                                                                                      ',
      u_eff_band_date: new Date('1900-01-01T00:00:00.000Z'),
      wl_status: '200',
      u_novalet_ref: '2000111',
      app_band: 'URG',
      post_code: 'H04 7OT   ',
      corr_addr:
        '26 Toban Junction                                                                                                                                     ',
      bedrooms: '1                   '
    };

    const gateway = createGateway([customer]);

    const record = await gateway.execute(id);
    expect(record).toEqual({
      address: [
        {
          address: [],
          source: 'UHT-HousingRegister-WaitingList'
        },
        {
          address: ['26 Toban Junction'],
          source: 'UHT-HousingRegister-Correspondence'
        }
      ],
      dob: [expect.stringContaining('1965-03-25')],
      housingRegister: {
        applicationRef: 'DIR6940111',
        applicationStatus: 'Cancelled',
        band: 'Urgent',
        bedroomReq: '1                   ',
        biddingNo: '2000111',
        startDate: new Date('1900-01-01T00:00:00.000Z')
      },
      name: [{ first: 'Hillel', last: 'Lorenz', title: 'Mr' }],
      nino: ['AB106755C'],
      phone: [],
      postcode: ['H04 7OT'],
      systemIds: { uhtHousingRegister: ['DIR6940111/4'] }
    });
  });

  it('catches and calls logger', async () => {
    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(Logger.error).toHaveBeenCalledWith(
      'Error fetching customers in UHT-HousingRegister: Error: Database error',
      dbError
    );
  });
});
