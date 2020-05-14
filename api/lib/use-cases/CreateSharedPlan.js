module.exports = ({ fetchRecords, sharedPlan }) => {
  return async ({ customerId }) => {
    const record = await fetchRecords(customerId);

    if (!record) {
      throw new Error('Unable to create plan, unknown customer');
    }

    const plan = await sharedPlan.create({
      customer: {
        firstName: record.firstName,
        lastName: record.lastName,
        systemIds: [record.id, ...Object.values(record.systemIds)]
      }
    });

    return plan;
  };
};
