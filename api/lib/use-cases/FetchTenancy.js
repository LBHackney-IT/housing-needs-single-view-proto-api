module.exports = options => {
  const fetchTenancyGateway = options.fetchTenancyGateway;
  const matServiceFetchContactsGateway = options.matServiceFetchContactsGateway;
  const matServiceFetchTasksGateway = options.matServiceFetchTasksGateway;

  return async (id, token) => {
    const tenancy = await fetchTenancyGateway.execute(id, token);
    const contacts = await matServiceFetchContactsGateway.execute(tenancy.uprn);
    const tasks = await matServiceFetchTasksGateway.execute(id);
    tenancy.contacts = contacts;

    tenancy.tasks = tasks;
    return tenancy;
  };
};
