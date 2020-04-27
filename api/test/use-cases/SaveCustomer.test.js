describe('SaveCustomer', () => {
  const gateway = { execute: jest.fn(() => []) };
  const saveCustomer = require('../../lib/use-cases/SaveCustomer')({ gateway });

  it(`calls gateway with correct record`, () => {
    const record = {
      firstName: 'laura',
      lasName: 'J',
      dob: '1990-01-02'
    };
    saveCustomer(record);

    expect(gateway.execute).toHaveBeenCalledWith(record);
  });
});
