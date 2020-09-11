module.exports = options => {
  const fetchTenancyGateway = options.fetchTenancyGateway;
  const matServiceFetchContactsGateway = options.matServiceFetchContactsGateway;

  return async (id, token) => {
    const tenancy = await fetchTenancyGateway.execute(id, token);
    const contacts = await matServiceFetchContactsGateway.execute(tenancy.uprn);
    tenancy.contacts = contacts;

    return tenancy;
  };
};
