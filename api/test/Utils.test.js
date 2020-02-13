const { compareDateStrings } = require('../lib/Utils');

describe('Utils', () => {
  const records = [
    {
      startDate: '2019-03-20'
    },
    {
      startDate: '2019-03-23'
    }
  ];

  const expected = [
    {
      startDate: '2019-03-23'
    },
    {
      startDate: '2019-03-20'
    }
  ];

  it('orders two records by start date in descending order', async () => {
    const result = records.sort(compareDateStrings);
    expect(result).toStrictEqual(expected);
  });

  it('does not change order when a date is absent', async () => {
    const record = [{ start_date: '2019-03-20' }, { start_date: '' }];
    const result = record.sort(compareDateStrings);

    expect(result).toStrictEqual(record);
  });

  it('does not change order when a date is absent (example two)', async () => {
    const record = [{ start_date: '' }, { start_date: '2019-03-20' }];
    const result = record.sort(compareDateStrings);

    expect(result).toStrictEqual(record);
  });

  it('It returns nothing when given an empty array', async () => {
    const record = [];
    const result = record.sort(compareDateStrings);

    expect(result).toStrictEqual(record);
  });
});
