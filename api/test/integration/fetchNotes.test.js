require('dotenv').config();
const path = require('path');
const singleViewDb = require('../../lib/PostgresDb');
const { loadSQL } = require('../../../api/lib/Utils');
const { truncateTablesSQL, insertLinksSQL } = loadSQL(
  path.join(__dirname, 'sql')
);

const BASE_URL = 'http://localhost:3010';

describe('Fetch Notes', () => {
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

  it('returns no notes for non-existent customer', async () => {
    const response = await doSearchRequest(`customers/131/notes`);
    expect(response).toStrictEqual({
      notes: []
    });
  });

  it('returns no notes for customer that has no notes', async () => {
    const response = await doSearchRequest(`customers/130/notes`);
    expect(response).toStrictEqual({
      notes: []
    });
  });

  it('can return one note from UHT-Contacts', async () => {
    const response = await doSearchRequest(`customers/123/notes`);
    expect(response).toStrictEqual({
      notes: [
        {
          date: '2020-02-25 12:00:00',
          id: 176403472,
          system: 'UHT-ActionDiary',
          text: 'Operative analyzing conglomeration',
          title: 'Action Diary Note',
          user: 'SYSTEM'
        }
      ]
    });
  });
});
