const academyCouncilTaxFetchDocuments = require('../../../lib/gateways/Academy-CouncilTax/FetchDocuments');

describe('AcademyCouncilTaxFetchDocumentsGateway', () => {
  let cominoFetchDocumentsGateway;
  let getSystemId;
  const id = '123';
  const record = { account_ref: '123' };

  const createGateway = (records, throwsError, existsInSystem) => {
    cominoFetchDocumentsGateway = {
      execute: jest.fn(async () => {
        if (throwsError) {
          throw new Error('Database error');
        }
        return records;
      })
    };

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return academyCouncilTaxFetchDocuments({
      cominoFetchDocumentsGateway,
      getSystemId
    });
  };

  it('gets the docs if customer has a system id', async () => {
    const gateway = createGateway([], false, true);

    const cominoParamMatcher = expect.objectContaining(record);

    await gateway.execute(id);

    expect(cominoFetchDocumentsGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('queries the database with the account reference if the query contains an account reference', async () => {
    const gateway = createGateway([], false, true);

    const cominoParamMatcher = expect.objectContaining(record);

    await gateway.execute(id);

    expect(cominoFetchDocumentsGateway.execute).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('does not get the docs if customer does not have a system id ', async () => {
    const gateway = createGateway([]);
    const result = await gateway.execute(id);

    expect(cominoFetchDocumentsGateway.execute).toHaveBeenCalledTimes(0);
    expect(result.length).toBe(0);
  });

  it('returns an empty set of records if there is an error', async () => {
    const gateway = createGateway([record], true);

    const documents = await gateway.execute();

    expect(documents.length).toBe(0);
  });
});
