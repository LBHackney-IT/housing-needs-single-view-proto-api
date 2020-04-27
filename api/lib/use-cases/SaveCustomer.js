module.exports = options => {
  const gateway = options.gateway;

  return async records => {
    return await gateway.execute(records);
  };
};
