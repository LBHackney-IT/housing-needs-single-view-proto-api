module.exports = ({ fetchRecords, sharedPlan }) => {
  return async ({ customerId, token }) => {
    const record = await fetchRecords(customerId);

    if (!record) {
      throw new Error('Unable to find plans, unknown customer');
    }

    const { planIds } = await sharedPlan.find({
      firstName: record.firstName,
      lastName: record.lastName,
      systemIds: [record.id, ...Object.values(record.systemIds)],
      token
    });

    return { planIds };
  };
};
