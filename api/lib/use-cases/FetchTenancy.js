module.exports = options => {
  const fetchTenancyGateway = options.fetchTenancyGateway;
  const fetchTenantsGateway = options.fetchTenantsGateway;

  return async (id, token) => {
    const tenancy = await fetchTenancyGateway.execute(id, token);
    const tenants = await fetchTenantsGateway.execute(id, token);
    tenancy.tenants = tenants;

    return tenancy;
  };
};
