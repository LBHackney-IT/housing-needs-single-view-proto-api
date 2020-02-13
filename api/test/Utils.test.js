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

  it('orders one records by start date in descending order', async () => {
    const result = records.sort(compareDateStrings);
    expect(result).toStrictEqual(expected);
  });
});
