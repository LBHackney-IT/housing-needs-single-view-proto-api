describe('FetchRecords', () => {
  let fetchRecords;
  let gateways;

  const recordsFromA = [{ id: '1231' }];
  const recordsFromB = [{ id: '2345' }];

  const customerLinks = [
    { name: 'UHT', remote_id: 1 },
    { name: 'UHW', remote_id: 1 }
  ];

  beforeEach(() => {
    gateways = {
      UHT: { execute: jest.fn(() => recordsFromA) },
      UHW: { execute: jest.fn(() => recordsFromB) },
      Jigsaw: { execute: jest.fn(() => []) },
      SINGLEVIEW: { getAll: jest.fn(() => []) }
    };

    fetchRecords = require('../../lib/use-cases/FetchRecords')({
      cleanRecord: jest.fn(),
      gateways: gateways,
      getCustomerLinks: {
        execute: jest.fn(async () => {
          return customerLinks;
        })
      },
      mergeResponses: jest.fn(() => ({}))
    });
  });

  it("can query for a customer's records from multiple gateways", async () => {
    const id = 1;
    const token = 'abc';

    await fetchRecords(id, token);

    for (const link of customerLinks) {
      expect(gateways[link.name].execute).toHaveBeenCalledWith(id, token);
    }
  });
});
