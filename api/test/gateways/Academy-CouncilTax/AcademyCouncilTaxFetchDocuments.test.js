const academyCouncilTaxFetchDocuments = require('@lib/gateways/Academy-CouncilTax/AcademyCouncilTaxFetchDocuments');

describe('AcademyCouncilTaxFetchDocumentsGateway', () => {
  let Comino;

  const createGateway = (records, throwsError) => {
    Comino = {
      fetchCustomerDocuments: jest.fn(async () => {
        if (throwsError) {
          return new Error('Database error');
        }
        return records;
      })
    };

    return academyCouncilTaxFetchDocuments({ Comino });
  };

  it('If the query contains an account reference then the database gets queried with the account reference', async () => {
    const gateway = createGateway([]);
    const account_ref = '123';

    const cominoParamMatcher = expect.objectContaining({ account_ref: '123' });

    await gateway.execute(account_ref);

    expect(Comino.fetchCustomerDocuments).toHaveBeenCalledWith(
      cominoParamMatcher
    );
  });

  it('returns an empty object if an error is thrown', async () => {
    const gateway = createGateway([]);

    const documents = await gateway.execute();

    expect(documents.length).toBe(0);
  });
});
