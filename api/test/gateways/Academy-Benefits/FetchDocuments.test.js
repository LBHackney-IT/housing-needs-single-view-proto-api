const academyBenefitsFetchDocuments = require('../../../lib/gateways/Academy-Benefits/FetchDocuments');
const { Systems } = require('../../../lib/Constants');

describe('AcademyBenefitsFetchDocumentsGateway', () => {
  const id = '123';
  let buildDocument;
  let db;
  let cominoFetchDocumentsGateway;
  let getSystemId;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildDocument = jest.fn();

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    cominoFetchDocumentsGateway = {
      execute: jest.fn()
    };

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return academyBenefitsFetchDocuments({
      buildDocument,
      db,
      cominoFetchDocumentsGateway
    });
  };

  it('gets the docs if customer has a system id', async () => {
    const gateway = createGateway([], true);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    const cominoParamMatcher = expect.objectContaining({ claim_id: '123' });

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(cominoFetchDocumentsGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('does not get the docs if customer does not have a system id', async () => {
    const gateway = createGateway([]);
    await gateway.execute(null);

    expect(db.request).toHaveBeenCalledTimes(0);
    expect(cominoFetchDocumentsGateway.execute).toHaveBeenCalledTimes(0);
  });

  it('builds a document', async () => {
    const record = { id, correspondence_code: 'code' };
    const gateway = createGateway([record], true);

    await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'code'
    });
    expect(buildDocument).toHaveBeenCalledTimes(1);
    expect(buildDocument).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty set of documents if there is an error', async () => {
    const record = { id };
    const gateway = createGateway([record], true, true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
