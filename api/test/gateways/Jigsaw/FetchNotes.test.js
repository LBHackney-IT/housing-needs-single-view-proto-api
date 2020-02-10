const jigsawFetchNotes = require('../../../lib/gateways/Jigsaw/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('JigsawFetchNotesGateway', () => {
  const id = '123';

  let doJigsawGetRequest;
  const jigsawEnv = '_test';
  let getSystemId;
  let doGetRequest;
  let buildNote;

  const createGateway = (
    records,
    existsInSystem,
    throwsError,
    returnsNotes
  ) => {
    buildNote = jest.fn(input => {
      return input;
    });

    doJigsawGetRequest = jest.fn(async url => {
      if (throwsError) {
        throw new Error('error');
      }
      if (url.includes('casecheck')) return { cases: records };
      return records;
    });

    doGetRequest = jest.fn(async () => {
      if (throwsError) {
        throw new Error('error');
      }
      return records;
    });

    getSystemId = {
      execute: jest.fn(async (name, id) => {
        if (existsInSystem) return id;
      })
    };

    return jigsawFetchNotes({
      doJigsawGetRequest,
      jigsawEnv,
      buildNote,
      getSystemId,
      doGetRequest
    });
  };

  it('gets the system ID', async () => {
    const gateway = createGateway([], true);

    await gateway.execute(id);

    expect(getSystemId.execute).toHaveBeenCalledWith(Systems.JIGSAW, '123');
  });

  it('gets customer notes if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);

    await gateway.execute(id);
    const urlMatcher = expect.stringContaining(
      `https://zebracustomers${jigsawEnv}.azurewebsites.net/api/Customer/${id}/Notes`
    );

    expect(doJigsawGetRequest).toHaveBeenCalledWith(urlMatcher);
  });

  it('gets case notes if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);

    await gateway.execute(id);
    const urlMatcher = expect.stringContaining(
      `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/casecheck/`
    );

    const casesUrlMatcher = expect.stringContaining(
      `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/Cases/${id}/Notes`
    );
    expect(doJigsawGetRequest).toHaveBeenCalledTimes(3);
    expect(doJigsawGetRequest).toHaveBeenNthCalledWith(2, urlMatcher);
    expect(doJigsawGetRequest).toHaveBeenNthCalledWith(3, casesUrlMatcher);
  });

  it('gets customer sms if customer has a system id', async () => {
    const gateway = createGateway([{ id }], true);

    await gateway.execute(id, '12345');
    const urlMatcher = expect.stringContaining(
      `${process.env.COLLAB_CASEWORK_API}/contacts`
    );

    const casesUrlMatcher = expect.stringContaining(
      `${process.env.COLLAB_CASEWORK_API}/contacts/${id}/messages`
    );
    expect(doGetRequest).toHaveBeenCalledTimes(2);
    expect(doGetRequest).toHaveBeenNthCalledWith(
      1,
      urlMatcher,
      expect.anything(),
      expect.objectContaining({ Authorization: 'Bearer 12345' })
    );
    expect(doGetRequest).toHaveBeenNthCalledWith(2, casesUrlMatcher);
  });

  it('can build a note from an sms', async () => {
    const record = { id, outgoing: false, username: 'Maria' };
    const gateway = createGateway([record], true);
    await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(3);
    expect(buildNote).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Incoming SMS' })
    );
  });

  it('can build a note from a customer note', async () => {
    const record = { content: 'text' };
    const gateway = createGateway([record], true, false, true);
    await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(3);
    expect(buildNote).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Customer Note' })
    );
  });

  it('can build a note from a case note', async () => {
    const record = { content: 'text' };
    const gateway = createGateway([record], true, false);
    await gateway.execute(id);

    expect(buildNote).toHaveBeenCalledTimes(3);
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
