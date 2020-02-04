const academyBenefitsFetchDocuments = require('../../../lib/gateways/Academy-Benefits/AcademyBenefitsFetchDocuments');
const { Systems } = require('../../../lib/Constants');

describe('AcademyBenefitsFetchDocumentsGateway', () => {
  let buildDocument;
  let db;
  let cominoGateway;
  let getSystemId;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildDocument = jest.fn(({}) => {
      return {};
    });

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    cominoGateway = {
      execute: jest.fn(async () => {
        return [];
      })
    };

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return academyBenefitsFetchDocuments({
      buildDocument,
      db,
      cominoGateway,
      getSystemId
    });
  };

  it('gets the system ID', async () => {
    const gateway = createGateway([], true);
    id = '123';

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(
      Systems.ACADEMY_BENEFITS,
      '123'
    );
  });

  it('if customer has a system id we get the docs', async () => {
    const gateway = createGateway([], true, false);
    const id = '123/1';
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);

    const cominoParamMatcher = expect.objectContaining({ claim_id: '123' });

    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(cominoGateway.execute).toHaveBeenCalledWith(cominoParamMatcher);
  });

  it('if customer does not have a system id we do not get the docs', async () => {
    const gateway = createGateway([], false, false);
    const id = '123/1';
    await gateway.execute(id);

    expect(db.request).toHaveBeenCalledTimes(0);
    expect(cominoGateway.execute).toHaveBeenCalledTimes(0);
  });

  it('builds a document', async () => {
    const id = '123';
    const record = { id: '123', correspondence_code: 'code' };
    const gateway = createGateway([record], true, false);

    await gateway.execute(id);

    const recordMatcher = expect.objectContaining({
      text: 'code'
    });
    expect(buildDocument).toHaveBeenCalledTimes(1);
    expect(buildDocument).toHaveBeenCalledWith(recordMatcher);
  });

  it('returns an empty set of documents if there is an error', async () => {
    const id = '123';
    const record = { id: '123' };
    const gateway = createGateway([record], true, true);

    const records = await gateway.execute(id);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
