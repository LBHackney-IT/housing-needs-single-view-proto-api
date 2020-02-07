const jigsawFetchNotes = require('../../../lib/gateways/Jigsaw/FetchNotes');
const { Systems } = require('../../../lib/Constants');

describe('JigsawFetchNotesGateway', () => {
  const id = '123';

  let doJigsawGetRequest;
  const jigsawEnv = '_test';
  let getSystemId;
  let doGetRequest;

  const createGateway = (records, existsInSystem, throwsError) => {
    buildNote = jest.fn();

    doJigsawGetRequest = jest.fn(async () => {
      if (throwsError) {
        throw new Error('error');
      }
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

    await gateway.execute(id);
    const urlMatcher = expect.stringContaining(
      `${process.env.COLLAB_CASEWORK_API}/contacts`
    );

    const casesUrlMatcher = expect.stringContaining(
      `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/Cases/${id}/Notes`
    );
    expect(doGetRequest).toHaveBeenCalledTimes(3);
    expect(doGetRequest).toHaveBeenNthCalledWith(2, urlMatcher);
    expect(doGetRequest).toHaveBeenNthCalledWith(3, casesUrlMatcher);
  });
});
