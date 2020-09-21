describe('FetchAreaPatch', () => {
  const gatewayResponse = {
    patchCode: 'AB1',
    areaName: 'area name',
    ward: 'ward name',
    officerFullName: 'officer name',
    original: {}
  };

  const matServiceFetchAreaPatchGateway = {
    execute: jest.fn(() => gatewayResponse)
  };

  fetchAreaPatch = require('../../lib/use-cases/FetchAreaPatch')({
    matServiceFetchAreaPatchGateway
  });

  it('can fetch area patch from the MaT Service API Gateway and return it', async () => {
    const uprn = 12345678910;

    const result = await fetchAreaPatch(uprn);

    expect(matServiceFetchAreaPatchGateway.execute).toHaveBeenCalledWith(uprn);
    expect(result).toBe(gatewayResponse);
  });
});
