const academyBenefitsSearch = require('../../../lib/gateways/Academy-Benefits/Search');
const nock = require('nock');

describe('AcademyBenefitsSearchGateway', () => {
  let buildSearchRecord;
  let logger;
  const dbError = new Error('Database error');

  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    searchDb = async (queryParams) => {
    if (throwsError) throw dbError; 
      return records
    }

    searchAPI = async () => {};

    logger = {
      error: jest.fn((msg, err) => {})
    };

    return academyBenefitsSearch({
      buildSearchRecord,
      searchDb,
      searchAPI,
      logger
    });
  };

  it('returns record if all id components exist', async () => {
    const record = { claim_id: '123', check_digit: 'd', person_ref: '1' };
    const gateway = createGateway([record]);
    const recordMatcher = expect.objectContaining({ id: '123d/1' });

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(1);
    expect(buildSearchRecord).toHaveBeenCalledWith(recordMatcher);
    expect(records.length).toBe(1);
  });

  it("doesn't return a record if any of the id components are missing", async () => {
    const record = { claim_id: '123', check_digit: 'd' };
    const gateway = createGateway([record]);

    const records = await gateway.execute({});

    expect(buildSearchRecord).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });

  it('returns an empty set of records if there is an error and calls logger', async () => {
    const record = { claim_id: '123', check_digit: 'd', person_ref: '1' };
    const gateway = createGateway([record], true);

    const records = await gateway.execute({});

    expect(records.length).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      'Error searching customers in Academy-Benefits: Error: Database error',
      dbError
    );
  });
});
