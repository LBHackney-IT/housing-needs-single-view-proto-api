const searchTenancy = require('../../lib/use-cases/SearchTenancies');
describe('Search tenancies', () => {
  let mockGateway;

  const createUsecase = (tenancies = []) => {
    mockGateway = {
      search: jest.fn(() => ({
        tenancies
      }))
    }
    return searchTenancy({
      gateway: mockGateway
    })
  }
  const mockTenancies = [{
    tenancyAgreementReference: "000473/03",
    address: "3 Hillman Street",
    postcode: "E1 7HG",
    commencementOfTenancyDate: "1987-10-17",
    endOfTenancyDate: null,
  }, {
    tenancyAgreementReference: "526389/04",
    address: "2nd Floor Flat",
    postcode: "N6 TY7",
    commencementOfTenancyDate: "2010-04-15",
    endOfTenancyDate: "2030-04-15",
  }, {
    tenancyAgreementReference: "526389/04",
    address: "2nd Floor Flat",
    postcode: "N6 TY7",
    commencementOfTenancyDate: "2010-04-15",
    endOfTenancyDate: "2018-04-15",
  }];

  it('can search a tenancy with query parameters', async () => {
    const queryParameters = {
      address: "some address",
      freehold_only: true,
      leasehold_only: true
    };
    const usecase = createUsecase()
    await usecase(queryParameters);
    expect(mockGateway.search).toHaveBeenCalledWith(queryParameters);
  })

  it('returns the tenancies from the gateway', async () => {
    const tenancies = [{
      tenancyAgreementReference: "000473/03",
      address: "3 Hillman Street",
      postcode: "E1 7HG",
    }, {
      tenancyAgreementReference: "526389/04",
      address: "2nd Floor Flat",
      postcode: "N6 TY7",
    }];

    const usecase = createUsecase(tenancies)
    const result = await usecase({});
    expect(result).toEqual(tenancies);
  })

  it('can return only current tenants', async () => {
    const usecase = createUsecase(mockTenancies)
    const result = await usecase({ current_tenancies: true });
    expect(result).toEqual([mockTenancies[0], mockTenancies[1]]);
  })

  it('can return only former tenants', async () => {
    const usecase = createUsecase(mockTenancies)
    const result = await usecase({ former_tenancies: true });
    expect(result).toEqual([mockTenancies[2]]);
  })
});
