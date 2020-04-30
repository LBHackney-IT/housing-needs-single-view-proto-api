const { Systems } = require('../../Constants');
const {
  nameCase,
  formatAddress,
  formatRecordDate,
  upperCase
} = require('../../Utils');
const merge = require('@brikcss/merge');
const moment = require('moment');

module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const logger = options.logger;

  const caseUrl = `${process.env.JigsawHomelessnessBaseSearchUrl}/api/casecheck/`;
  const accomPlacementsUrl = caseId =>
    `${process.env.JigsawAccommodationBaseSearchUrl}/api/CaseAccommodationPlacement?caseId=${caseId}`;
  const customerUrl = id =>
    `${process.env.JigsawCustomerBaseSearchUrl}/api/CustomerOverview/${id}`;

  const fetchCases = async id => {
    return await doJigsawGetRequest(caseUrl + id);
  };

  const fetchAccomPlacements = async caseId => {
    return await doJigsawGetRequest(accomPlacementsUrl(caseId));
  };

  const fetchCustomer = async id => {
    return await doJigsawGetRequest(customerUrl(id));
  };

  const processCases = (id, result) => {
    let customer = {
      systemIds: {
        jigsaw: [id]
      },
      housingNeeds: {}
    };
    if (result.cases && result.cases.filter(c => c.isCurrent).length > 0) {
      const curr = result.cases.filter(c => c.isCurrent)[0];
      customer.housingNeeds.jigsawCaseId = curr.id.toString();
      customer.housingNeeds.status = curr.statusName;
    } else {
      customer.housingNeeds.status = 'No homelessness case';
    }
    return customer;
  };

  const processAccomPlacements = result => {
    let customer = {
      housingNeeds: {}
    };

    if (result.isCurrentlyInPlacement) {
      const curr = result.placements.filter(
        p => p.endDate === null || moment(p.endDate).isAfter()
      )[0];

      customer.housingNeeds.currentPlacement = {};

      customer.housingNeeds.currentPlacement.address = curr.address;
      customer.housingNeeds.currentPlacement.duty = curr.placementDuty;
      customer.housingNeeds.currentPlacement.type = curr.placementType;
      customer.housingNeeds.currentPlacement.rentCostCustomer =
        curr.rentCostCustomer;
      customer.housingNeeds.currentPlacement.tenancyId = curr.tenancyId;

      if (curr.startDate !== null) {
        customer.housingNeeds.currentPlacement.startDate = formatRecordDate(
          curr.startDate
        );
      }

      if (curr.endDate !== null) {
        customer.housingNeeds.currentPlacement.endDate = formatRecordDate(
          curr.endDate
        );
      }
    }

    return customer;
  };

  const processCustomer = function(result) {
    const info = result.personInfo;

    let customer = {
      team: {}
    };

    customer.address = [
      {
        source: Systems.JIGSAW,
        address: formatAddress(info.addressString)
      }
    ];
    customer.dob = [formatRecordDate(info.dateOfBirth)];
    customer.email = [info.emailAddress];
    customer.phone = [info.homePhoneNumber, info.mobilePhoneNumber];
    customer.nhsNumber = info.nhsNumber;
    customer.nino = [upperCase(info.nationalInsuranceNumber)];

    if (result.personInfo.supportWorker !== null) {
      customer.team.name = nameCase(info.supportWorker.fullName);
      customer.team.jobTitle = info.supportWorker.jobTitle;
      customer.team.agency = info.supportWorker.agency;
      customer.team.phone = info.supportWorker.phoneNumber;
      customer.team.email = info.supportWorker.emailAddress;
    }

    return customer;
  };

  return {
    execute: async id => {
      try {
        const caseDetails = processCases(id, await fetchCases(id));

        let accomPlacements = {};
        if (caseDetails.housingNeeds.jigsawCaseId) {
          accomPlacements = processAccomPlacements(
            await fetchAccomPlacements(caseDetails.housingNeeds.jigsawCaseId)
          );
        }

        const customerDetails = processCustomer(await fetchCustomer(id));
        const customer = merge(
          ...[caseDetails, accomPlacements, customerDetails]
        );

        return customer;
      } catch (err) {
        logger.error(`Error fetching customers in Jigsaw: ${err}`, err);
      }
    }
  };
};
