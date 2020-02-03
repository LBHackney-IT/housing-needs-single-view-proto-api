const groupSearchRecords = require('../../lib/use-cases/GroupSearchRecords')(
  ({ Systems } = require('../../lib/Constants'))
);

const createTwoRecordsWithMatchingProps = (prop, value) => {
  const record = {
    [prop]: value
  };
  return [record, record];
};

const expectRecordsToHaveBeenGrouped = results => {
  expect(results.grouped.length).toBe(1);
  expect(results.ungrouped.length).toBe(0);
};

describe('GroupSearchRecords', () => {
  it(`groups records where uhContact id's are equal`, () => {
    const records = createTwoRecordsWithMatchingProps('links', {
      uhContact: 11026
    });

    const results = groupSearchRecords(records);

    expectRecordsToHaveBeenGrouped(results);
  });

  it(`groups records where hbClaimId id's are equal`, () => {
    const records = createTwoRecordsWithMatchingProps('links', {
      hbClaimId: 500512
    });

    const results = groupSearchRecords(records);

    expectRecordsToHaveBeenGrouped(results);
  });

  it(`groups records where national insurance numbers are equal`, () => {
    const records = createTwoRecordsWithMatchingProps('nino', 'XPD123');

    const results = groupSearchRecords(records);

    expectRecordsToHaveBeenGrouped(results);
  });

  it(`groups records where dob's are equal`, () => {
    const records = createTwoRecordsWithMatchingProps('dob', '10/10/1990');

    const results = groupSearchRecords(records);

    expectRecordsToHaveBeenGrouped(results);
  });

  it(`puts groups of length one into ungrouped`, () => {
    const records = createTwoRecordsWithMatchingProps('dob', '10/10/1990');
    records.push({ dob: '11/11/1990' });

    const results = groupSearchRecords(records);

    expect(results.grouped.length).toBe(1);
    expect(results.ungrouped.length).toBe(1);
  });

  it('extracts records that have already been connected', () => {
    const records = [
      {
        id: '1',
        source: 'UHT-Contacts'
      },
      {
        id: '2',
        source: 'UHW'
      },
      {
        id: 5,
        source: 'SINGLEVIEW',
        links: [
          {
            id: 11,
            remote_id: '1',
            system_name: 'UHT-Contacts'
          },
          {
            id: 12,
            remote_id: '2',
            system_name: 'UHW'
          }
        ]
      }
    ];

    const results = groupSearchRecords(records);

    expect(results.grouped.length).toBe(0);
    expect(results.ungrouped.length).toBe(0);
    expect(results.connected.length).toBe(1);
  });
});
