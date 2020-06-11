const createSharedPlan = require('../../lib/use-cases/CreateSharedPlan');

describe('CreateSharedPlan', () => {
  const expectedRecord = {
    id: '123',
    name: [
      {
        first: 'Bob',
        last: 'Smith'
      }
    ],
    systemIds: {
      ACADEMY: 'ACADEMY-123',
      JIGSAW: 'JIGSAW-123'
    },
    phone: [],
    email: []
  };

  const expectedPlanId = 'SP-1';
  const expectedToken = 'a-very-secure-token';

  const container = {
    sharedPlan: {
      create: jest.fn(() => ({ id: expectedPlanId }))
    },
    fetchRecords: jest.fn(() => expectedRecord)
  };

  it('creates a shared plan using the customer details', async () => {
    const execute = createSharedPlan(container);

    const plan = await execute({
      customerId: expectedRecord.id,
      token: expectedToken
    });

    expect(container.sharedPlan.create).toHaveBeenCalledWith({
      customer: {
        firstName: expectedRecord.name[0].first,
        lastName: expectedRecord.name[0].last,
        systemIds: expect.arrayContaining([
          expectedRecord.id,
          expectedRecord.systemIds.ACADEMY,
          expectedRecord.systemIds.JIGSAW
        ]),
        numbers: [],
        emails: [],
        hasPhp: false
      },
      token: expectedToken
    });

    expect(plan.id).toBe(expectedPlanId);
  });

  it('creates a shared plan with correct details if customer has php', async () => {
    expectedRecord.housingNeeds = { jigsawCaseId: '123' };
    const execute = createSharedPlan(container);

    const plan = await execute({
      customerId: expectedRecord.id,
      token: expectedToken
    });

    expect(container.sharedPlan.create).toHaveBeenCalledWith({
      customer: {
        firstName: expectedRecord.name[0].first,
        lastName: expectedRecord.name[0].last,
        systemIds: expect.arrayContaining([
          expectedRecord.id,
          expectedRecord.systemIds.ACADEMY,
          expectedRecord.systemIds.JIGSAW
        ]),
        numbers: [],
        emails: [],
        hasPhp: true
      },
      token: expectedToken
    });

    expect(plan.id).toBe(expectedPlanId);
  });
});
