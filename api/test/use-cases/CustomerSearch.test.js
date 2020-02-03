describe('CustomerSearch', () => {
  const recordsFromA = [{ id: 1 }, { id: 2 }];
  const recordsFromB = [{ id: 5 }];

  let gateways;
  let groupSearchRecords;
  let cleanRecord;
  let customerSearch;

  beforeEach(() => {
    cleanRecord = (() => {
      return jest.fn(record => record);
    })();

    gateways = [
      {
        execute: jest.fn(() => recordsFromA)
      },
      {
        execute: jest.fn(() => recordsFromB)
      }
    ];

    groupSearchRecords = (() => {
      return jest.fn(records => records);
    })();

    customerSearch = require('../../lib/use-cases/CustomerSearch')({
      cleanRecord,
      gateways,
      groupSearchRecords
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

  it('can clean the records', async () => {
    const records = await customerSearch();

    expect(cleanRecord).toHaveBeenCalledTimes(records.length);
  });

  it('can group the records', async () => {
    const records = await customerSearch();

    expect(groupSearchRecords).toHaveBeenCalledWith(records.map(cleanRecord));
  });
});
