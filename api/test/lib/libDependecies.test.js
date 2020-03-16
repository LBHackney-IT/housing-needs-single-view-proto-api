beforeEach(() => {
  jest.resetModules();
  jest.mock('../../lib/SqlServerConnection');
  jest.mock('../../lib/PostgresDb', () => jest.fn());
  jest.mock('../../lib/JigsawUtils.js', () => ({
    doJigsawGetRequest: jest.fn(),
    doJigsawPostRequest: jest.fn(),
    doGetRequest: jest.fn()
  }));

  jest.mock('../../lib/gateways/SingleView/CustomerLinks', () => () => ({
    execute: jest.fn(async () => [])
  }));
});

describe('libDependencies', () => {
  it('is able to initialise the use cases', async () => {
    const {
      addVulnerability,
      customerSearch,
      fetchDocuments,
      fetchNotes,
      fetchRecords
    } = require('../../lib/libDependencies');

    expect(addVulnerability).toBeDefined();
    expect(customerSearch).toBeDefined();
    expect(fetchDocuments).toBeDefined();
    expect(fetchNotes).toBeDefined();
    expect(fetchRecords).toBeDefined();
  });
});
