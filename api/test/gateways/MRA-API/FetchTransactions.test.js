const FetchTransactions = require('../../../lib/gateways/MRA-API/FetchTransactions');
const nock = require('nock');

describe('MRA-API FetchTransactions gateway', () => {
  const paymentRef = '0000000001';
  const postcode = 'AB1QWE';
  const data = {
    request: {
      paymentRef: '0000000001',
      postCode: 'AB1QWE'
    },
    transactions: [
      {
        date: '2019-10-02T00:00:00',
        description: 'Total Charge',
        in: '',
        out: '(¤104.10)',
        balance: '¤66.78'
      }
    ]
  };

  const createGateway = (response, paymentRef, postcode) => {
    const baseUrl = 'https://test-domain.com';
    const apiToken = 'anbdabkd';

    nock(baseUrl, {
      reqheaders: {
        'x-api-key': apiToken
      }
    })
      .get(
        `/api/v1/transactions/payment-ref/${paymentRef}/post-code/${postcode}`
      )
      .reply(200, response);

    return FetchTransactions({
      baseUrl,
      apiToken
    });
  };

  it('queries the API with appropriate parameters', async () => {
    const gateway = createGateway(data, paymentRef, postcode);
    await gateway.execute(paymentRef, postcode);
    expect(nock.isDone()).toBe(true);
  });

  it('returns the data from the API', async () => {
    const gateway = createGateway(data, paymentRef, postcode);

    const response = await gateway.execute(paymentRef, postcode);
    expect(response).toEqual(data);
  });
});
