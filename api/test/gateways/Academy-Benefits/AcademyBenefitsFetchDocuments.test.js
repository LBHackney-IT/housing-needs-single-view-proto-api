const academyBenefitsFetchDocuments = require('../../../lib/gateways/Academy-Benefits/AcademyBenefitsFetchDocuments');

describe('AcademyBenefitsFetchDocumentsGateway', () => {
  let buildDocument;
  let db;
  let Comino;

  const createGateway = (records, throwsError) => {
    buildDocument = jest.fn(({}) => {
      return {};
    });

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          return new Error('Database error');
        }
        return records;
      })
    };

    Comino = {
      fetchCustomerDocuments: jest.fn(async () => {
        return [];
      })
    };

    return academyBenefitsFetchDocuments({
      buildDocument,
      db,
      Comino
    });
  };

  it('if the query contains ID then the database gets queried with the id', async () => {
    const gateway = createGateway([]);
    const id = '123/1';
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    const cominoParamMatcher = expect.objectContaining({ claim_id: '123' });

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(Comino.fetchCustomerDocuments).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('returns a single record', async () => {
    const id = '123';
    const record = { id: '123', correspondence_code: 'code' };
    const gateway = createGateway([record]);

    const records = await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'code'
    });
    expect(buildDocument).toHaveBeenCalledTimes(1);
    expect(records.length).toBe(1);
    expect(buildDocument).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty object if an error is thrown', async () => {
    const id = '123';
    const record = { id: '123' };
    const gateway = createGateway([record], true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
