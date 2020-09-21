module.exports = options => {
  const matServiceFetchAreaPatchGateway =
    options.matServiceFetchAreaPatchGateway;

  return async uprn => {
    const areaPatch = await matServiceFetchAreaPatchGateway.execute(uprn);

    return areaPatch;
  };
};
