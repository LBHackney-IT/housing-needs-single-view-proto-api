module.exports = options => {
  const jigsawDocGateway = options.jigsawDocGateway;

  return async id => {
    return jigsawDocGateway.execute(id);
  };
};
