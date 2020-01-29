describe('JigsawSearchGateway', () => {
  let buildSearchRecord;
  let db;

  const createGateway = (records, throwsError) => {
    buildSearchRecord = jest.fn(({ id }) => {
      return { id };
    });

    db = {
      request: jest.fn(async () => {
        if (throwsError) {
          return new Error('Database error');
        }
        return records;
      })
    };

    return academyCouncilTaxSearchGateway({
      buildSearchRecord,
      db
    });
  };

  it('if the query contains firstname then the db is queried for firstname', async () => {
    const gateway = createGateway([]);
    const firstName = 'maria';
    const queryMatcher = expect.stringMatching(/LIKE @full_name/);
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: firstName.toUpperCase() })
    ]);

    await gateway.execute({ firstName });

    expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
  });
});
