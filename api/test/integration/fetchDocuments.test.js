require('dotenv').config();
const path = require('path');
const singleViewDb = require('../../lib/PostgresDb');
const { loadSQL } = require('../../../api/lib/Utils');
const { truncateTablesSQL, insertLinksSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

const BASE_URL = 'http://localhost:3010';

describe('Fetch Documents', () => {
  const rp = require('request-promise');
  const doSearchRequest = async uri => {
    const options = {
      method: 'GET',
      uri: `${BASE_URL}/${uri}`,
      json: true
    };
    return await rp(options);
  };

  beforeEach(async () => {
    await singleViewDb.any(truncateTablesSQL);
    await singleViewDb.any(insertLinksSQL);
  });

  afterAll(singleViewDb.$pool.end);

  it('returns no documents for non-existent customer', async () => {
    const response = await doSearchRequest(`customers/131/documents`);
    expect(response).toStrictEqual({
      documents: []
    });
  });

  it('returns no documents for customer that has no documents', async () => {
    const response = await doSearchRequest(`customers/130/documents`);
    expect(response).toStrictEqual({
      documents: []
    });
  });

  it('can return one document from UHW', async () => {
    const response = await doSearchRequest(`customers/125/documents`);
    expect(response).toStrictEqual({
      documents: [
        {
          date: '2015-05-17 12:00:00',
          format: 'pdf',
          id: 123,
          system: 'UHW',
          text: 'this is a doc',
          title: 'document',
          user: 'ONE',
          userid: 4186867
        }
      ]
    });
  });

  it('can return documents from Academy-Benefits and Comino', async () => {
    const response = await doSearchRequest(`customers/127/documents`);
    expect(response).toStrictEqual({
      documents: [
        {
          date: '2018-11-21 12:00:00',
          format: null,
          id: 1,
          system: 'ACADEMY-Benefits',
          text: 'LL-ADJUSTMENT',
          title: 'Academy Document',
          user: 'meap',
          userid: null
        },
        {
          date: '2015-05-17 12:00:00',
          format: 'rtf',
          id: 321,
          system: 'COMINO',
          text: 'this is a docy',
          title: 'documenty',
          user: 'ONEY',
          userid: 6060591
        }
      ]
    });
  });

  it('can return Academy-councilTax document from Comino', async () => {
    const response = await doSearchRequest(`customers/128/documents`);
    expect(response).toStrictEqual({
      documents: [
        {
          date: '2015-05-17 12:00:00',
          format: 'rtf',
          id: 321,
          system: 'COMINO',
          text: 'this is a docy',
          title: 'documenty',
          user: 'ONEY',
          userid: 35205909
        }
      ]
    });
  });

  it('can return one document from Jigsaw', async () => {
    const response = await doSearchRequest(`customers/126/documents`);
    expect(response).toStrictEqual({
      documents: [
        {
          date: '2011-07-05 01:00:00',
          id: 121212,
          system: 'JIGSAW',
          title: 'Document',
          userid: '12345'
        }
      ]
    });
  });

  it('can return documents from all systems', async () => {
    const response = await doSearchRequest(`customers/133/documents`);
    expect(response).toStrictEqual({
      documents: [
        {
          date: '2015-05-17 12:00:00',
          format: 'pdf',
          id: 123,
          system: 'UHW',
          text: 'this is a doc',
          title: 'document',
          user: 'ONE',
          userid: 4186867
        },
        {
          date: '2011-07-05 01:00:00',
          id: 121212,
          system: 'JIGSAW',
          title: 'Document',
          userid: '12345'
        },
        {
          date: '2018-11-21 12:00:00',
          format: null,
          id: 1,
          system: 'ACADEMY-Benefits',
          text: 'LL-ADJUSTMENT',
          title: 'Academy Document',
          user: 'meap',
          userid: null
        },
        {
          date: '2015-05-17 12:00:00',
          format: 'rtf',
          id: 321,
          system: 'COMINO',
          text: 'this is a docy',
          title: 'documenty',
          user: 'ONEY',
          userid: 6060591
        },
        {
          date: '2015-05-17 12:00:00',
          format: 'rtf',
          id: 321,
          system: 'COMINO',
          text: 'this is a docy',
          title: 'documenty',
          user: 'ONEY',
          userid: 35205909
        }
      ]
    });
  });
});
