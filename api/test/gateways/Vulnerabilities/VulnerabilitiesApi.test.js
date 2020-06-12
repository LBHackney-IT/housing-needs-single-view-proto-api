const nock = require('nock');
const VulnerabilitiesApi = require('../../../lib/gateways/Vulnerabilities/VulnerabilitiesApi');

describe('VulnerabilitiesApi', () => {
  describe('create', () => {
    const expectedSnapshotId = '1';
    const expectedToken = 'a-really-secure-token';

    beforeEach(() => {
      nock('https://vulnerabilities', {
        reqheaders: {
          authorization: `Bearer ${expectedToken}`
        }
      })
        .post('/api/snapshots')
        .reply(201, { id: expectedSnapshotId });
    });

    it('calls the API endpoint with a valid body', async () => {
      const api = new VulnerabilitiesApi({
        baseUrl: 'https://vulnerabilities'
      });
      const createdSnapshot = await api.create({
        token: expectedToken,
        customer: {
          firstName: 'Stanley',
          lastName: 'McTest',
          systemIds: ['123', '456', '789']
        }
      });

      expect(createdSnapshot.id).toBe(expectedSnapshotId);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('find', () => {
    const expectedResponse = { snapshotIds: ['1', '2'] };
    const expectedToken = 'a-really-secure-token';

    beforeEach(() => {
      nock('https://vulnerabilities', {
        reqheaders: {
          Authorization: `Bearer ${expectedToken}`
        }
      })
        .post('/api/snapshots/find')
        .reply(200, expectedResponse);
    });

    it('calls the API endpoint with valid body', async () => {
      const api = new VulnerabilitiesApi({
        baseUrl: 'https://vulnerabilities'
      });
      const { snapshotIds } = await api.find({
        token: expectedToken,
        firstName: 'Stanley',
        lastName: 'McTest',
        systemIds: ['123', '456']
      });

      expect(snapshotIds).toStrictEqual(expectedResponse.snapshotIds);
      expect(nock.isDone()).toBe(true);
    });

    it('returns an empty array if error', async () => {
      const api = new VulnerabilitiesApi({
        baseUrl: 'https://vulnerabilities'
      });
      const { snapshotIds } = await api.find({});

      expect(snapshotIds).toStrictEqual([]);
    });
  });
});
