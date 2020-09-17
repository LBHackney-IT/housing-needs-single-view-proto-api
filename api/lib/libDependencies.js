let Sentry;
if (process.env.ENV === 'staging' || process.env.ENV === 'production') {
  Sentry = require('@sentry/node');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV
  });
}

const logger = require('./logger')({ Sentry });

const { Systems } = require('./Constants');
const SqlServerConnection = require('./SqlServerConnection');

const academyDb = new SqlServerConnection({
  dbUrl: process.env.ACADEMY_DB,
  logger: logger
});

const uhtDb = new SqlServerConnection({
  dbUrl: process.env.UHT_DB,
  logger: logger
});

const uhwDb = new SqlServerConnection({
  dbUrl: process.env.UHW_DB,
  logger: logger
});

const cominoDb = new SqlServerConnection({
  dbUrl: process.env.HN_COMINO_URL,
  logger: logger
});

const singleViewDb = require('./PostgresDb');
const buildSearchRecord = require('./entities/SearchRecord')();
const buildDocument = require('./entities/Document')();
const buildNote = require('./entities/Note')();
const cleanRecord = require('./use-cases/CleanRecord')({
  badData: {
    address: ['10 Elmbridge Walk, Blackstone Estate, London, E8 3HA'],
    dob: ['01/01/1900']
  }
});
const mergeResponses = require('../lib/MergeResponses');

const { fetchW2Documents } = require('./W2Utils');

const {
  doJigsawGetRequest,
  doJigsawPostRequest,
  doGetRequest
} = require('./JigsawUtils');

const getCustomerLinks = require('./gateways/SingleView/CustomerLinks')({
  db: singleViewDb,
  logger
});

// SEARCH GATEWAYS

const jigsawSearchGateway = require('./gateways/Jigsaw/Search')({
  doJigsawGetRequest,
  buildSearchRecord,
  logger
});
const academyBenefitsSearchGateway = require('./gateways/Academy-Benefits/Search')(
  {
    buildSearchRecord,
    baseUrl: process.env.ACADEMY_API_BASE_URL,
    apiToken: process.env.ACADEMY_API_API_TOKEN,
    logger
  }
);
const uhtContactsSearchApi = require('./gateways/UHT-Contacts/SearchApi')({
  baseUrl: process.env.HOUSING_API_BASE_URL,
  apiKey: process.env.HOUSING_API_API_KEY,
  token: process.env.HOUSING_API_TOKEN,
  buildSearchRecord,
  logger
});
const uhtContactsSearchDb = require('./gateways/UHT-Contacts/SearchDb')({
  db: uhtDb,
  buildSearchRecord
});
const uhtContactsSearchGateway = require('./gateways/UHT-Contacts/Search')({
  searchDb: uhtContactsSearchDb,
  searchApi: uhtContactsSearchApi,
  logger
});
const uhtHousingRegisterSearchGateway = require('./gateways/UHT-HousingRegister/Search')(
  {
    db: uhtDb,
    buildSearchRecord,
    logger
  }
);
const academyCouncilTaxSearchGateway = require('./gateways/Academy-CouncilTax/Search')(
  {
    db: academyDb,
    buildSearchRecord,
    logger
  }
);

const uhwSearchGateway = require('./gateways/UHW/Search')({
  db: uhwDb,
  buildSearchRecord,
  logger
});
const singleViewSearchGateway = require('./gateways/SingleView/Search')({
  db: singleViewDb,
  buildSearchRecord,
  logger
});

// DOCUMENT GATEWAYS

const academyBenefitsFetchDocumentsGateway = require('./gateways/Academy-Benefits/FetchDocuments')(
  {
    db: academyDb,
    buildDocument,
    fetchW2Documents,
    logger
  }
);
const uhwFetchDocumentsGateway = require('./gateways/UHW/FetchDocuments')({
  buildDocument,
  fetchW2Documents,
  logger
});
const jigsawFetchDocumentsGateway = require('./gateways/Jigsaw/FetchDocuments')(
  {
    buildDocument,
    fetchDocMetadataGateway: require('../../jigsaw/gateways/FetchDocumentMetadata')(
      {
        doJigsawGetRequest,
        doJigsawPostRequest
      }
    ),
    logger
  }
);
const academyCouncilTaxFetchDocumentsGateway = require('./gateways/Academy-CouncilTax/FetchDocuments')(
  {
    buildDocument,
    fetchW2Documents,
    logger
  }
);

// RECORDS GATEWAYS
const academyBenefitsFetchDb = require('./gateways/Academy-Benefits/FetchCustomerDB')(
  {
    db: academyDb
  }
);
const academyBenefitsFetchAPI = require('./gateways/Academy-Benefits/FetchCustomerAPI')(
  {
    baseUrl: process.env.ACADEMY_API_BASE_URL,
    apiToken: process.env.ACADEMY_API_API_TOKEN //Lambda authoriser token
  }
);
const academyBenefitsFetchRecordsGateway = require('./gateways/Academy-Benefits/FetchRecord.js')(
  {
    db: academyDb,
    fetchDB: academyBenefitsFetchDb,
    fetchAPI: academyBenefitsFetchAPI,
    logger
  }
);

const uhtContactsFetchRecordsGateway = require('./gateways/UHT-Contacts/FetchRecord')(
  {
    db: uhtDb,
    buildNote,
    logger
  }
);

const uhtHousingRegisterFetchRecordsGateway = require('./gateways/UHT-HousingRegister/FetchRecord')(
  {
    db: uhtDb,
    buildNote,
    logger
  }
);

const academyCouncilTaxFetchRecordsGateway = require('./gateways/Academy-CouncilTax/FetchRecord')(
  {
    db: academyDb,
    logger
  }
);

const uhwFetchRecordsGateway = require('./gateways/UHW/FetchRecord')({
  db: uhwDb,
  logger
});

const jigsawFetchRecordsGateway = require('./gateways/Jigsaw/FetchRecord')({
  doJigsawGetRequest,
  doGetRequest,
  logger
});

const matServiceFetchContactsGateway = require('./gateways/MaT-Service-API/FetchContacts')(
  {
    baseUrl: process.env.MAT_SERVICE_API_BASE_URL,
    apiToken: process.env.MAT_SERVICE_API_TOKEN
  }
);

const matServiceFetchTasksGateway = require('./gateways/MaT-Service-API/FetchTasks')(
  {
    baseUrl: process.env.MAT_SERVICE_API_BASE_URL,
    apiToken: process.env.MAT_SERVICE_API_TOKEN
  }
);
const cautionaryAlertsGateway = require('./gateways/CautionaryAlerts/CautionaryAlertsApi')(
  {
    logger: logger,
    baseUrl: process.env.CAUTIONARY_ALERTS_BASE_URL,
    apiToken: process.env.CAUTIONARY_ALERTS_API_TOKEN //Lambda authoriser token
  }
);

// NOTES GATEWAYS

const cominoFetchNotesGateway = require('./gateways/Comino/FetchNotes')({
  buildNote,
  db: cominoDb,
  logger
});
const academyBenefitsFetchNotesGateway = require('./gateways/Academy-Benefits/FetchNotes')(
  {
    db: academyDb,
    buildNote,
    cominoFetchNotesGateway,
    logger
  }
);
const uhtContactsFetchNotesGateway = require('./gateways/UHT-Contacts/FetchNotes')(
  {
    db: uhtDb,
    buildNote,
    logger
  }
);
const uhtHousingRegisterFetchNotesGateway = require('./gateways/UHT-HousingRegister/FetchNotes')(
  {
    db: uhtDb,
    buildNote,
    logger
  }
);
const academyCouncilTaxFetchNotesGateway = require('./gateways/Academy-CouncilTax/FetchNotes')(
  {
    cominoFetchNotesGateway,
    logger
  }
);
const uhwFetchNotesGateway = require('./gateways/UHW/FetchNotes')({
  db: uhwDb,
  buildNote,
  logger
});
const jigsawFetchNotesGateway = require('./gateways/Jigsaw/FetchNotes')({
  doJigsawGetRequest,
  doGetRequest,
  buildNote,
  logger
});

// Other gateways

const SharedPlanApi = require('./gateways/SharedPlan/SharedPlanApi');
const sharedPlan = new SharedPlanApi({
  baseUrl: process.env.SHARED_PLAN_BASE_URL
});

const VulnerabilitiesApi = require('./gateways/Vulnerabilities/VulnerabilitiesApi');
const vulnerabilities = new VulnerabilitiesApi({
  baseUrl: process.env.VULNERABILITIES_BASE_URL
});

const uhtFetchTenantsGateway = require('./gateways/UHT-Tenancies/FetchTenants')(
  {
    db: uhtDb,
    logger
  }
);

const uhtFetchTenancyGateway = require('./gateways/UHT-Tenancies/FetchTenancy')(
  {
    db: uhtDb,
    logger
  }
);

const tenanciesApi = require('./gateways/Tenancies/TenanciesApi')({
  baseUrl: process.env.TENANCY_API_BASE_URL,
  token: process.env.TENANCY_API_TOKEN,
  logger
});

// USECASES

const customerSearch = require('./use-cases/CustomerSearch')({
  cleanRecord,
  gateways: [
    jigsawSearchGateway,
    academyBenefitsSearchGateway,
    uhtContactsSearchGateway,
    uhtHousingRegisterSearchGateway,
    academyCouncilTaxSearchGateway,
    uhwSearchGateway,
    singleViewSearchGateway
  ],
  groupSearchRecords: require('./use-cases/GroupSearchRecords')()
});

const fetchDocuments = require('./use-cases/FetchDocuments')({
  gateways: {
    [Systems.UHW]: uhwFetchDocumentsGateway,
    [Systems.ACADEMY_BENEFITS]: academyBenefitsFetchDocumentsGateway,
    [Systems.ACADEMY_COUNCIL_TAX]: academyCouncilTaxFetchDocumentsGateway,
    [Systems.JIGSAW]: jigsawFetchDocumentsGateway
  },
  getCustomerLinks
});

const fetchRecords = require('./use-cases/FetchRecords')({
  cleanRecord,
  gateways: {
    [Systems.UHT_CONTACTS]: uhtContactsFetchRecordsGateway,
    [Systems.UHT_HOUSING_REGISTER]: uhtHousingRegisterFetchRecordsGateway,
    [Systems.UHW]: uhwFetchRecordsGateway,
    [Systems.ACADEMY_BENEFITS]: academyBenefitsFetchRecordsGateway,
    [Systems.ACADEMY_COUNCIL_TAX]: academyCouncilTaxFetchRecordsGateway,
    [Systems.JIGSAW]: jigsawFetchRecordsGateway
  },
  getCustomerLinks,
  mergeResponses
});

const fetchNotes = require('./use-cases/FetchNotes')({
  gateways: {
    [Systems.UHT_CONTACTS]: uhtContactsFetchNotesGateway,
    [Systems.UHT_HOUSING_REGISTER]: uhtHousingRegisterFetchNotesGateway,
    [Systems.UHW]: uhwFetchNotesGateway,
    [Systems.ACADEMY_BENEFITS]: academyBenefitsFetchNotesGateway,
    [Systems.ACADEMY_COUNCIL_TAX]: academyCouncilTaxFetchNotesGateway,
    [Systems.JIGSAW]: jigsawFetchNotesGateway
  },
  getCustomerLinks
});

const createRecordGateway = require('./gateways/SingleView/CreateRecord')({
  db: singleViewDb,
  logger
});
const saveCustomer = require('./use-cases/SaveCustomer')({
  gateway: createRecordGateway
});

const deleteCustomerGateway = require('./gateways/SingleView/DeleteCustomer')({
  db: singleViewDb,
  logger
});
const deleteCustomer = require('./use-cases/DeleteCustomer')({
  gateway: deleteCustomerGateway
});

const createSharedPlan = require('./use-cases/CreateSharedPlan')({
  fetchRecords,
  sharedPlan
});

const findSharedPlans = require('./use-cases/FindSharedPlans')({
  fetchRecords,
  sharedPlan
});

const createVulnerabilitySnapshot = require('./use-cases/CreateVulnerabilitySnapshot')(
  {
    fetchRecords,
    vulnerabilities
  }
);

const findVulnerabilitySnapshots = require('./use-cases/FindVulnerabilitySnapshots')(
  {
    fetchRecords,
    vulnerabilities
  }
);

const fetchTenancy = require('./use-cases/FetchTenancy')({
  fetchTenancyGateway: uhtFetchTenancyGateway,
  matServiceFetchContactsGateway,
  fetchTenantsGateway: uhtFetchTenantsGateway,
  matServiceFetchTasksGateway
});

const searchTenancies = require('./use-cases/SearchTenancies')({
  gateway: tenanciesApi
});

const fetchCautionaryAlerts = require('./use-cases/FetchCautionaryAlerts')({
  cautionaryAlertsGateway
});

module.exports = {
  Sentry,
  customerSearch,
  fetchDocuments,
  fetchRecords,
  fetchNotes,
  saveCustomer,
  deleteCustomer,
  createSharedPlan,
  findSharedPlans,
  createVulnerabilitySnapshot,
  findVulnerabilitySnapshots,
  fetchTenancy,
  searchTenancies,
  fetchCautionaryAlerts
};
