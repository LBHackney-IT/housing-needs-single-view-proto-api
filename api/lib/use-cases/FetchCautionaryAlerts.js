module.exports = options => {
  const cautionaryAlertsGateway = options.cautionaryAlertsGateway;

  return async (tag_ref, person_no) => {
    const contacts = await cautionaryAlertsGateway.alertsForPeople(
      tag_ref,
      person_no
    );

    return contacts;
  };
};
