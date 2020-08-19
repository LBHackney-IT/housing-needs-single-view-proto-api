module.exports = options => {
  const gateway = options.gateway;

  return async (id, token) => {
    return await gateway.execute(id, token);
  };
};
