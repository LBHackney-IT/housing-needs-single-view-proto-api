const jigsawFetchNotes = require('../../../lib/gateways/Jigsaw/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('JigsawFetchNotesGateway', () => {
  const id = '123';

  let doJigsawGetRequest;
  let doGetRequest;
  let buildNote;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildNote = jest.fn(input => {
      return input;
    });

    doJigsawGetRequest = jest.fn(async url => {
      if (throwsError) {
        throw new Error('error');
      }
      if (url.includes('casecheck')) return { cases: records };
      if (url.includes('Notes')) return records;
    });

    doGetRequest = jest.fn(async () => {
      if (throwsError) {
        throw new Error('error');
      }
      return records;
    });

    return jigsawFetchNotes({
      doJigsawGetRequest,
      buildNote,
      doGetRequest
    });
  };

  it('gets customer notes if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);
    const urlMatcher = expect.stringContaining(`/api/Customer/${id}/Notes`);

    await gateway.execute(id);

    expect(doJigsawGetRequest).toHaveBeenCalledWith(urlMatcher);
  });

  it('gets case notes if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);
    const casesUrlMatcher = expect.stringContaining(`/api/casecheck/`);
    const caseNotesUrlMatcher = expect.stringContaining(
      `/api/Cases/${id}/Notes`
    );

    await gateway.execute(id);

    expect(doJigsawGetRequest).toHaveBeenCalledWith(casesUrlMatcher);
    expect(doJigsawGetRequest).toHaveBeenCalledWith(caseNotesUrlMatcher);
  });

  it('gets customer sms if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);
    const messagesUrlMatcher = expect.stringContaining(`/contacts`);

    await gateway.execute(id, '12345');

    expect(doGetRequest).toHaveBeenCalledWith(
      messagesUrlMatcher,
      { jigsawId: id },
      { Authorization: `Bearer 12345` }
    );
  });

  it('can build a note from an sms', async () => {
    const record = { id, jigsawId: id, outgoing: false, username: 'Maria' };
    const gateway = createGateway([record], true);

    await gateway.execute(id);

    // TODO: this is not totally correct as we dont currently have a way of differentiating between note types
    // (buildNote will get called 3 times in this test)
    expect(buildNote).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Incoming SMS' })
    );
  });

  it('can build a note from a customer note', async () => {
    const record = { content: 'text' };
    const gateway = createGateway([record], true, false);

    await gateway.execute(id);

    // TODO: this is not totally correct as we dont currently have a way of differentiating between note types
    // (buildNote will get called 3 times in this test)
    expect(buildNote).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Customer Note' })
    );
  });

  it('can build a note from a case note', async () => {
    const record = { content: 'text' };
    const gateway = createGateway([record], true, false);
    await gateway.execute(id);

    // TODO: this is not totally correct as we dont currently have a way of differentiating between note types
    // (buildNote will get called 3 times in this test)
    expect(buildNote).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Case Note' })
    );
  });

  it('returns empty records if an error is thrown', async () => {
    const gateway = createGateway([{}], true, true);
    const result = await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(0);
    expect(result.length).toBe(0);
  });
});
