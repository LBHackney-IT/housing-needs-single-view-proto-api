describe('CustomerSearch', () => {
  const recordsFromA = [{ id: 1 }, { id: 2 }];
  const recordsFromB = [{ id: 5 }];

  let gateways;
  let groupRecords;
  let validateRecords;
  let customerSearch;

  beforeEach(() => {
    gateways = [
      {
        execute: jest.fn(() => recordsFromA)
      },
      {
        execute: jest.fn(() => recordsFromB)
      }
    ];

    groupRecords = (() => {
      return jest.fn(records => records);
    })();

    validateRecords = (() => {
      return jest.fn(records => records);
    })();

    customerSearch = require('../../lib/use-cases/CustomerSearch')({
      gateways,
      groupRecords,
      validateRecords
    });
  });

  it('can query for a customer on multiple gateways', async () => {
    const query = {
      firstName: 'john',
      lastName: 'smith'
    };

    await customerSearch(query);

    gateways.forEach(gateway => {
      expect(gateway.execute).toHaveBeenCalledWith(query);
    });
  });

  it('concatenates the results', async () => {
    const expectedRecords = [].concat(recordsFromA, recordsFromB);

    const records = await customerSearch();

    expect(records).toEqual(expect.arrayContaining(expectedRecords));
    expect(records.length).toEqual(expectedRecords.length);
  });

  it('can validate the records', async () => {
    const records = await customerSearch();

    expect(validateRecords).toHaveBeenCalledWith(records);
  });

  it('can group the records', async () => {
    const records = await customerSearch();

    expect(groupRecords).toHaveBeenCalledWith(validateRecords(records));
  });
});
