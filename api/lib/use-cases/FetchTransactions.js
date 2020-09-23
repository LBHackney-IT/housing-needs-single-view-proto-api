module.exports = options => {
  const mraApiFetchTransactionsGateway = options.mraApiFetchTransactionsGateway;
  const fetchTenancyGateway = options.fetchTenancyGateway;

  return async id => {
    const tenancy = await fetchTenancyGateway.execute(id);
    const tenancyTransactions = await mraApiFetchTransactionsGateway.execute(
      tenancy.paymentRef,
      tenancy.postCode
    );

    return tenancyTransactions;
  };
};
