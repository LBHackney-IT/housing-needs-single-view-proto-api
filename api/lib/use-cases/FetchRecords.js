module.exports = options => {
  const mergeResponses = options.mergeResponses;
  const cleanRecord = options.cleanRecord;
  const gateways = options.gateways;
  const getCustomerLinks = options.getCustomerLinks;

  return async (id, token) => {
    const links = await getCustomerLinks.execute(id);
    const requests = links.map(async link =>
      gateways[link.name].execute(link.remote_id, token)
    );

    const results = await Promise.all(requests);
    const customer = mergeResponses(results);

    if (!customer.housingRegister) {
      customer.housingRegister = {};
    }

    if (!customer.housingNeeds) {
      customer.housingNeeds = {};
    }

    return cleanRecord(customer);
  };
};
