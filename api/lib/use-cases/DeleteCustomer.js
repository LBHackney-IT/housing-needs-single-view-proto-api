module.exports = options => {
  const gateway = options.gateway;

  return async id => {
    return await gateway.execute(id);
  };
};
