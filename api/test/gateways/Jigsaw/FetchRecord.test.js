const JigsawFetchRecord = require('../../../lib/gateways/Jigsaw/FetchRecord');

describe('JigsawFetchRecord gateway', () => {
  let doJigsawGetRequest;

  const createGateway = (customerDetails, throwsError) => {
    doJigsawGetRequest = jest.fn(async url => {
      if (throwsError) {
        throw new Error('error');
      }
      if (url.includes('casecheck'))
        return {
          cases: [
            {
              assignedTo: 'Person',
              dateOfApproach: '2018-07-05T01:00:00',
              id: customerDetails.jigsawCaseId,
              isCurrent: true,
              isV2LegacyCase: true,
              statusName: customerDetails.application_status
            }
          ]
        };
      if (url.includes('CustomerOverview'))
        return {
          personInfo: {
            addressString: customerDetails.address,
            dateOfBirth: customerDetails.dob,
            emailAddress: customerDetails.email,
            homePhoneNumber: null,
            mobilePhoneNumber: customerDetails.phone,
            nhsNumber: '',
            nationalInsuranceNumber: customerDetails.nino,
            supportWorker: null
          }
        };
      if (url.includes('CaseAccommodationPlacement'))
        return {
          placements: [
            {
              address: customerDetails.currentPlacement.address,
              endDate: null,
              placementDuty: customerDetails.currentPlacement.duty,
              placementType: customerDetails.currentPlacement.type,
              startDate: customerDetails.currentPlacement.startDate,
              tenancyId: customerDetails.currentPlacement.tenancyId,
              rentCostCustomer:
                customerDetails.currentPlacement.rentCostCustomer
            }
          ],
          isCurrentlyInPlacement: true
        };
    });

    return JigsawFetchRecord({
      doJigsawGetRequest
    });
  };

  const customerDetails = {
    jigsawCaseId: '54321',
    address: 'Hackney London W3 43no',
    dob: '1991-02-13 12:00:00',
    email: 'james@hotmail.com',
    phone: '07666666666',
    nino: 'ABC12345D',
    application_status: 'Open',
    currentPlacement: {
      address: 'Room 1 hallway drive ',
      duty: 'Section 192',
      type: 'Accommodation secured by the Local Authority',
      rentCostCustomer: 0,
      tenancyId: 64444,
      startDate: '2019-04-05 12:00:00'
    }
  };

  it('makes requests to jigsaw with appropriate id', async () => {
    const gateway = createGateway(customerDetails);
    const id = '12345';

    const fetchCasesUrlMatcher = expect.stringContaining(
      `/api/casecheck/${id}`
    );

    const fetchAccomPlacementsUrlMatcher = expect.stringContaining(
      `/api/CaseAccommodationPlacement?caseId=${customerDetails.jigsawCaseId}`
    );

    const fetchCustomerUrlMatcher = expect.stringContaining(
      `/api/CustomerOverview/${id}`
    );

    await gateway.execute(id);
    expect(doJigsawGetRequest).toHaveBeenNthCalledWith(1, fetchCasesUrlMatcher);
    expect(doJigsawGetRequest).toHaveBeenNthCalledWith(
      2,
      fetchAccomPlacementsUrlMatcher
    );
    expect(doJigsawGetRequest).toHaveBeenNthCalledWith(
      3,
      fetchCustomerUrlMatcher
    );
  });

  it('returns nicely formatted customer data', async () => {
    const id = '12345';

    const gateway = createGateway(customerDetails);

    const record = await gateway.execute(id);

    expect(record).toEqual({
      systemIds: { jigsaw: [id] },
      housingNeeds: {
        jigsawCaseId: customerDetails.jigsawCaseId,
        status: customerDetails.application_status,
        currentPlacement: customerDetails.currentPlacement
      },
      team: {},
      address: [{ source: 'JIGSAW', address: [customerDetails.address] }],
      dob: [customerDetails.dob],
      email: [customerDetails.email],
      phone: [null, customerDetails.phone],
      nhsNumber: '',
      nino: [customerDetails.nino]
    });
  });

  it('catches and console logs errors', async () => {
    let consoleOutput = '';
    const storeLog = inputs => (consoleOutput += inputs);
    console['log'] = jest.fn(storeLog);

    const gateway = createGateway(null, true);

    await gateway.execute('id');

    expect(consoleOutput).toBe(
      'Error fetching customers in Jigsaw: Error: error'
    );
  });
});
