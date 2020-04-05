const academyBenefitsFetchDocuments = require('../../../lib/gateways/Academy-Benefits/FetchDocuments');
const buildDoc = require('../../../lib/entities/Document')();

const mockCominoDocuments = [
  {
    date: '2010-02-03T20:30:14.000Z',
    format: null,
    text: 'Housing Register form',
    title: 'Document',
    user: 'First.Last',
    system: 'COMINO'
  }
];

const prepareTestGateway = (gateway, dependencies = {}) => {
  return (opts = {}) => {
    const { raiseError } = opts;

    if (raiseError) return gateway({});

    return gateway(dependencies);
  };
};

describe('AcademyBenefitsFetchDocumentsGateway', () => {
  const id = '123';
  const token = 'a_token';
  const academyDocument = { id: '123', correspondence_code: 'code' };

  let buildDocument;
  let db;
  let fetchCominoDocuments;
  let createGateway;

  beforeEach(() => {
    buildDocument = jest.fn(doc => buildDoc(doc));
    db = {
      request: jest.fn(async () => [academyDocument])
    };
    fetchCominoDocuments = jest.fn(() => mockCominoDocuments);

    createGateway = prepareTestGateway(academyBenefitsFetchDocuments, {
      buildDocument,
      db,
      fetchCominoDocuments
    });
  });

  it('gets the docs if customer has a system id', async () => {
    const gateway = createGateway();
    const paramMatcher = expect.arrayContaining([
      expect.objectContaining({ value: '123' })
    ]);
    const cominoMatcher = { id: '123', gateway: 'hncomino' };

    await gateway.execute(id, token);

    expect(db.request).toHaveBeenCalledWith(expect.anything(), paramMatcher);
    expect(fetchCominoDocuments).toHaveBeenCalledWith(cominoMatcher, token);
  });

  it('does not get the docs if customer does not have a system id', async () => {
    const gateway = createGateway();
    await gateway.execute(null, token);

    expect(db.request).toHaveBeenCalledTimes(0);
  });

  it('builds each document fetched from Academy Benefits and Comino', async () => {
    const gateway = createGateway();

    await gateway.execute(id, token);

    const academyMatcher = expect.objectContaining({
      system: 'ACADEMY-Benefits',
      text: 'code'
    });

    const cominoMatcher = expect.objectContaining({
      system: 'COMINO',
      text: 'Housing Register form'
    });

    expect(buildDocument).toHaveBeenCalledTimes(2);
    expect(buildDocument).toHaveBeenCalledWith(academyMatcher);
    expect(buildDocument).toHaveBeenCalledWith(cominoMatcher);
  });

  it('returns an empty set of documents if there is an error', async () => {
    const gateway = createGateway({ raiseError: true });

    const records = await gateway.execute(id, token);

    expect(buildDocument).toHaveBeenCalledTimes(0);
    expect(records.length).toBe(0);
  });
});
