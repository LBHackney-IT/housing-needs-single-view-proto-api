describe('FetchTransactions', () => {
  const dummyTenancyGatewayResponse = {
    id: '123456/1',
    address: '12 Avenue Street',
    type: 'Secure',
    startDate: '1999-08-20',
    uprn: '123456',
    paymentRef: '0000000001',
    postCode: 'AB1QWE'
  };

  const dummyTransactionsGatewayCleanDataResponse = {
    request: {
      paymentRef: '0000000001',
      postCode: 'AB1QWE'
    },
    transactions: [
      {
        date: '02/10/2019',
        description: 'Total Charge',
        in: '',
        out: '-£104.10',
        balance: '-£66.78'
      }
    ]
  };

  const fetchTenancyGateway = {
    execute: jest.fn(() => dummyTenancyGatewayResponse)
  };

  const mraApiFetchTransactionsGateway = {
    execute: jest.fn(),
    cleanData: jest.fn(() => dummyTransactionsGatewayCleanDataResponse)
  };

  const fetchTransactions = require('../../lib/use-cases/FetchTransactions')({
    fetchTenancyGateway,
    mraApiFetchTransactionsGateway
  });

  it('can fetch transactions from the MRA API Gateway and return them', async () => {
    const id = '1';

    const tenancyResult = await fetchTenancyGateway.execute(id);
    const result = await fetchTransactions(id);

    expect(mraApiFetchTransactionsGateway.execute).toHaveBeenCalledWith(
      tenancyResult.paymentRef,
      tenancyResult.postCode
    );
    expect(result).toBe(dummyTransactionsGatewayCleanDataResponse);
  });
});
