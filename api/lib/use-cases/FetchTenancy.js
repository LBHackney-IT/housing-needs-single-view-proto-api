module.exports = options => {
  const fetchTenancyGateway = options.fetchTenancyGateway;
  const fetchTenantsGateway = options.fetchTenantsGateway;
  const matServiceFetchContactsGateway = options.matServiceFetchContactsGateway;
  const matServiceFetchTasksGateway = options.matServiceFetchTasksGateway;

  return async (id, token) => {
    const tenancy = await fetchTenancyGateway.execute(id, token);
    const contacts = await matServiceFetchContactsGateway.execute(tenancy.uprn);
    const tenants = await fetchTenantsGateway.execute(id);

    const mergedContacts = tenants.map(tenant => {
      contacts.forEach(contact => {
        if (
          tenant.firstName === contact.firstName &&
          tenant.lastName === contact.lastName &&
          Date.parse(tenant.dateOfBirth) === Date.parse(contact.dateOfBirth)
        ) {
          console.log(tenant);
          console.log(contact);
          if (contact.telephone1) tenant.telephone1 = contact.telephone1;
          if (contact.telephone2) tenant.telephone2 = contact.telephone2;
          if (contact.telephone3) tenant.telephone3 = contact.telephone3;
          if (contact.emailAddress) tenant.emailAddress = contact.emailAddress;
        }
      });
      return tenant;
    });

    tenancy.contacts = mergedContacts;

    const tasks = await matServiceFetchTasksGateway.execute(id);

    tenancy.tasks = tasks;
    return tenancy;
  };
};
