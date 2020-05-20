const findSharedPlans = require('../../lib/use-cases/FindSharedPlans');

describe('CreateSharedPlan', () => {
  const expectedRecord = {
    id: '123',
    firstName: 'Test',
    lastName: 'Person',
    systemIds: {
      ACADEMY: 'ACADEMY-123',
      JIGSAW: 'JIGSAW-123'
    }
  };

  const expectedPlanIds = ['123', '456'];
  const expectedToken = 'a-very-secure-token';

  const container = {
    sharedPlan: {
      find: jest.fn(() => ({ planIds: expectedPlanIds }))
    },
    fetchRecords: jest.fn(() => expectedRecord)
  };

  it('finds plans using the customer details', async () => {
    const execute = findSharedPlans(container);
    const expectedCustomer = {
      firstName: 'Test',
      lastName: 'Person',
      systemIds: ['123', 'ACADEMY-123', 'JIGSAW-123']
    };

    const { planIds } = await execute({
      customerId: '123',
      token: expectedToken
    });

    expect(container.sharedPlan.find).toHaveBeenCalledWith({
      ...expectedCustomer,
      token: expectedToken
    });

    expect(planIds).toBe(expectedPlanIds);
  });
});
