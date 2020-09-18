module.exports = options => {
  const matServiceFetchAreaPatchGateway =
    options.matServiceFetchAreaPatchGateway;

  return async (uprn, postcode) => {
    const areaPatch = await matServiceFetchAreaPatchGateway.execute(
      uprn,
      postcode
    );

    return areaPatch;
  };
};
