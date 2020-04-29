describe('DeleteCustomer', () => {
  const gateway = { execute: jest.fn(() => []) };
  const deleteCustomer = require('../../lib/use-cases/DeleteCustomer')({
    gateway
  });

  it(`calls gateway with correct id`, () => {
    const id = 123;
    deleteCustomer(id);
    expect(gateway.execute).toHaveBeenCalledWith(id);
  });
});
