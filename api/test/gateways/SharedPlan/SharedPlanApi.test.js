const nock = require('nock');
const SharedPlanApi = require('../../../lib/gateways/SharedPlan/SharedPlanApi');

describe('SharedPlanApi', () => {
  describe('create', () => {
    const expectedPlanId = 'SP-1';
    const expectedToken = 'a-really-secure-token';

    beforeEach(() => {
      nock('https://shared.plan', {
        reqheaders: {
          authorization: `Bearer ${expectedToken}`
        }
      })
        .post('/plans')
        .reply(201, { id: expectedPlanId });
    });

    it('calls the API endpoint with a valid body', async () => {
      const api = new SharedPlanApi({ baseUrl: 'https://shared.plan' });
      const createdPlan = await api.create({
        token: expectedToken,
        customer: {
          firstName: 'Stanley',
          lastName: 'McTest',
          systemIds: ['123', '456', '789']
        }
      });

      expect(createdPlan.id).toBe(expectedPlanId);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('find', () => {
    const expectedPlanIds = ['SP-1', 'SP-2'];
    const expectedToken = 'a-really-secure-token';

    beforeEach(() => {
      nock('https://shared.plan', {
        reqheaders: {
          authorization: `Bearer ${expectedToken}`
        }
      })
        .post('/plans/find')
        .reply(200, expectedPlanIds);
    });

    it('calls the API endpoint with valid querystring', async () => {
      const api = new SharedPlanApi({ baseUrl: 'https://shared.plan' });
      const { planIds } = await api.find({
        token: expectedToken,
        firstName: 'Stanley',
        lastName: 'McTest',
        systemIds: ['123', '456']
      });

      expect(planIds).toStrictEqual(expectedPlanIds);
      expect(nock.isDone()).toBe(true);
    });
  });
});
