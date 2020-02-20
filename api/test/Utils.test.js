const { compareDate: compareDate } = require('../lib/Utils');

describe('Utils', () => {
  const records = [
    {
      startDate: new Date(2019, 2, 20)
    },
    {
      startDate: new Date(2019, 2, 23)
    }
  ];

  const expected = [
    {
      startDate: new Date(2019, 2, 23)
    },
    {
      startDate: new Date(2019, 2, 20)
    }
  ];

  const dates = [
    {
      startDate: new Date(2019, 5, 1)
    },
    {
      startDate: new Date(2019, 2, 1)
    },
    {
      startDate: new Date(2019, 0, 3)
    },
    {
      startDate: new Date(2019, 0, 2)
    },
    {
      startDate: new Date(2019, 3, 1)
    },
    {
      startDate: new Date(2019, 4, 1)
    },
    {
      startDate: new Date(2019, 0, 1)
    }
  ];

  const expectedDates = [
    {
      startDate: new Date(2019, 5, 1)
    },
    {
      startDate: new Date(2019, 4, 1)
    },
    {
      startDate: new Date(2019, 3, 1)
    },
    {
      startDate: new Date(2019, 2, 1)
    },
    {
      startDate: new Date(2019, 0, 3)
    },
    {
      startDate: new Date(2019, 0, 2)
    },
    {
      startDate: new Date(2019, 0, 1)
    }
  ];

  it('orders two records by start date in descending order', async () => {
    const result = records.sort(compareDate);
    expect(result).toStrictEqual(expected);
  });

  it('does not change order when a date is absent', async () => {
    const record = [{ start_date: '2019-03-20' }, { start_date: '' }];
    const result = record.sort(compareDate);

    expect(result).toStrictEqual(record);
  });

  it('does not change order when a date is absent (example two)', async () => {
    const record = [{ start_date: '' }, { start_date: '2019-03-20' }];
    const result = record.sort(compareDate);

    expect(result).toStrictEqual(record);
  });

  it('It returns nothing when given an empty array', async () => {
    const record = [];
    const result = record.sort(compareDate);

    expect(result).toStrictEqual(record);
  });

  it('orders very specific dates that fail in descending order', async () => {
    const result = dates.sort(compareDate);
    expect(result).toStrictEqual(expectedDates);
  });
});
