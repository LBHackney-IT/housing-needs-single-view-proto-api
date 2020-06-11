module.exports = ({ fetchRecords, sharedPlan }) => {
  return async ({ customerId, token }) => {
    const record = await fetchRecords(customerId);

    if (!record) {
      throw new Error('Unable to create plan, unknown customer');
    }

    const systemIds = [].concat.apply(
      [customerId],
      Object.values(record.systemIds)
    );

    const jigsawCaseId =
      record.housingNeeds && record.housingNeeds.jigsawCaseId ? true : false;

    const plan = await sharedPlan.create({
      customer: {
        firstName: record.name[0].first,
        lastName: record.name[0].last,
        systemIds,
        numbers: record.phone,
        emails: record.email,
        hasPhp: jigsawCaseId
      },
      token
    });

    return plan;
  };
};
