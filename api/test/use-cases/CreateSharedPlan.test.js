const createSharedPlan = require('../../lib/use-cases/CreateSharedPlan');

describe('CreateSharedPlan', () => {
  const expectedRecord = {
    id: '123',
    firstName: 'Bob',
    lastName: 'Smith',
    systemIds: {
      ACADEMY: 'ACADEMY-123',
      JIGSAW: 'JIGSAW-123'
    }
  };

  const expectedPlanId = 'SP-1';

  const container = {
    sharedPlan: {
      create: jest.fn(() => ({ id: expectedPlanId }))
    },
    fetchRecords: jest.fn(() => expectedRecord)
  };

  it('creates a shared plan using the customer details', async () => {
    const execute = createSharedPlan(container);
    const plan = await execute({ customerId: expectedRecord.id });

    expect(container.sharedPlan.create).toHaveBeenCalledWith({
      customer: {
        firstName: expectedRecord.firstName,
        lastName: expectedRecord.lastName,
        systemIds: expect.arrayContaining([
          expectedRecord.id,
          expectedRecord.systemIds.ACADEMY,
          expectedRecord.systemIds.JIGSAW
        ])
      }
    });

    expect(plan.id).toBe(expectedPlanId);
  });
});
