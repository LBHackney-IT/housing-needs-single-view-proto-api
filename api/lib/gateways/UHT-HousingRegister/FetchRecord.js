const path = require('path');
const {
  formatPhone,
  formatAddress,
  checkString,
  nameCase,
  formatRecordDate,
  loadSQL
} = require('../../Utils');
const { Systems, HousingBands, ApplicationStatus } = require('../../Constants');
const { fetchCustomerSQL } = loadSQL(path.join(__dirname, 'sql'));

const fetchCustomer = async (id, db) => {
  const [app_ref, person_no] = id.split('/');

  return (
    await db.request(fetchCustomerSQL, [
      { id: 'app_ref', type: 'NVarChar', value: app_ref },
      { id: 'person_no', type: 'Int', value: person_no }
    ])
  )[0];
};

const processCustomerResults = result => {
  return {
    systemIds: {
      uhtHousingRegister: [`${result.app_ref.trim()}/${result.person_no}`]
    },
    name: [
      {
        first: nameCase(result.forename),
        last: nameCase(result.surname),
        title: nameCase(result.title)
      }
    ],
    dob: [formatRecordDate(result.dob)],
    phone: [
      formatPhone(result.home_phone),
      formatPhone(result.work_phone),
      formatPhone(result.u_memmobile)
    ].filter(x => x),
    address: [
      {
        source: `${Systems.UHT_HOUSING_REGISTER}-WaitingList`,
        address: formatAddress(result.m_address)
      },
      {
        source: `${Systems.UHT_HOUSING_REGISTER}-Correspondence`,
        address: formatAddress(result.corr_addr)
      }
    ],
    postcode: [checkString(result.post_code)],
    nino: [checkString(result.ni_no)],
    housingRegister: {
      applicationRef: result.app_ref,
      applicationStatus: ApplicationStatus[result.wl_status] || 'Unknown',
      biddingNo: result.u_novalet_ref,
      band: HousingBands[result.app_band] || 'Unknown',
      startDate: result.u_eff_band_date,
      bedroomReq: result.bedrooms
    }
  };
};

module.exports = options => {
  const db = options.db;
  const logger = options.logger;

  return {
    execute: async id => {
      try {
        const customer = await fetchCustomer(id, db);
        return processCustomerResults(customer);
      } catch (err) {
        logger.error(
          `Error fetching customers in UHT-HousingRegister: ${err}`,
          err
        );
      }
    }
  };
};
