const moment = require('moment');

module.exports = ({ gateway }) => {
  const dateNotPassed = (date) =>
  date === null || moment(date, "YYYY-MM-DD") >= moment();

  const dateHasPassed = (date) =>
  date !== null && moment(date, "YYYY-MM-DD") < moment();

  return async ({
      address,
      freehold_only,
      leasehold_only,
      current_tenancies,
      former_tenancies
    }) => {
      const result = await gateway.search({
        address,
        freehold_only,
        leasehold_only,
      });
      if (current_tenancies) {
        return result.tenancies.filter(tenancy => dateNotPassed(tenancy.endOfTenancyDate))
      }

      if (former_tenancies) {
        return result.tenancies.filter(tenancy => dateHasPassed(tenancy.endOfTenancyDate))
      }
      return result.tenancies;
    }
}
