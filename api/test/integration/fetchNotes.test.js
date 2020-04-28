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

  it('can return one note from UHT-HousingRegister', async () => {
    const response = await doSearchRequest(`customers/124/notes`);
    expect(response).toStrictEqual({
      notes: [
        {
          date: '2016-04-18 01:00:00',
          system: 'UHT-HousingRegister',
          text: 'Object-based composite complexity',
          title: 'Note',
          user: 'SYSTEM'
        }
      ]
    });
  });

  it('can return one note from UHW', async () => {
    const response = await doSearchRequest(`customers/125/notes`);
    expect(response).toStrictEqual({
      notes: [
        {
          date: '2016-10-19 01:00:00',
          id: 92,
          system: 'UHW',
          text: 'Fully-configurable composite model',
          title: 'Note',
          user: 'DANA'
        }
      ]
    });
  });

  it('can return one note from Jigsaw', async () => {
    const response = await doSearchRequest(`customers/126/notes`);
    expect(response).toStrictEqual({
      notes: [{}]
    });
  });

  it('can return notes from Academy-Benefits and Comino', async () => {
    const response = await doSearchRequest(`customers/127/notes`);
    expect(response).toStrictEqual({
      notes: [
        {
          date: '2010-03-19 12:08:59',
          id: '000000000ctax',
          system: 'ACADEMY-Benefits',
          text: 'discrepancies report...assessment classification is correct.',
          title: 'Note',
          user: 'aaaaaaa'
        },
        {
          date: '2010-03-18 03:04:43',
          id: '000000001Zero',
          system: 'ACADEMY-Benefits',
          text:
            'transaction Subsidy project:  Removed Coa tick from zero transaction for the period 110210-150210.',
          title: 'Note',
          user: 'bbbbbbbb'
        },
        {
          date: '2010-03-01 10:20:21',
          id: '000000002copy',
          system: 'ACADEMY-Benefits',
          text:
            'of death certificate and intention to claim letter coppied over on to claim 60437767',
          title: 'Note',
          user: 'oododo'
        },
        {
          date: '2010-02-23 11:34:30',
          id: '000000003Email',
          system: 'ACADEMY-Benefits',
          text:
            'receievd from PO, so case reassigned to myselfClaim canx effective 11.02.10 ( CTB) and effective 15.02.10 (HB)The claiamnts partner want to continue the claimI have set up a correspondence claim 00000000 for the partnerI will send out an lll on this claim, send a memo to control to amend creditor ref and send out a claim form as well, when the claim transfers over to momomo',
          title: 'Note',
          user: 'oododo'
        },
        {
          date: '2010-02-11 11:44:39',
          id: '000000004Email',
          system: 'ACADEMY-Benefits',
          text: "rec'd from LL on 05/02/10 notifying of rent increase wef:",
          title: 'Note',
          user: 'bebeo'
        },
        {
          date: '2019-11-20 12:00:00',
          id: 1,
          system: 'COMINO',
          text: 'Exclusive 3rd generation help-desk',
          title: 'Note',
          user: 'TOUTOU'
        }
      ]
    });
  });

  it('can return Academy-councilTax note from Comino', async () => {
    const response = await doSearchRequest(`customers/128/notes`);
    expect(response).toStrictEqual({
      notes: [
        {
          date: '2018-01-29 12:00:00',
          id: 2,
          system: 'COMINO',
          text: 'Organic optimizing circuit',
          title: 'Note',
          user: 'TOUTOU'
        }
      ]
    });
  });

  it('can return notes from all systems', async () => {
    const response = await doSearchRequest(`customers/129/notes`);
    expect(response).toStrictEqual({
      notes: []
    });
  });
});
