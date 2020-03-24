const { Systems } = require('./Constants');
const SqlServerConnection = require('./SqlServerConnection');
const academyDb = new SqlServerConnection({ dbUrl: process.env.ACADEMY_DB });
const uhtDb = new SqlServerConnection({ dbUrl: process.env.UHT_DB });
const uhwDb = new SqlServerConnection({ dbUrl: process.env.UHW_DB });
const cominoDb = new SqlServerConnection({ dbUrl: process.env.HN_COMINO_URL });
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

const {
  doJigsawGetRequest,
  doJigsawPostRequest,
  doGetRequest,
  doGetDocRequest,
  login
} = require('./JigsawUtils');

const getCustomerLinks = require('./gateways/SingleView/CustomerLinks')({
  db: singleViewDb
});

const vulnerabilitiesGateway = require('./gateways/SingleView/Vulnerabilities')(
  {
    buildNote,
    db: singleViewDb
  }
);

// SEARCH GATEWAYS

const jigsawSearchGateway = require('./gateways/Jigsaw/Search')({
  doJigsawGetRequest,
  buildSearchRecord
});
const academyBenefitsSearchGateway = require('./gateways/Academy-Benefits/Search')(
  {
    db: academyDb,
    buildSearchRecord
  }
);
const uhtContactsSearchGateway = require('./gateways/UHT-Contacts/Search')({
  db: uhtDb,
  buildSearchRecord
});
const uhtHousingRegisterSearchGateway = require('./gateways/UHT-HousingRegister/Search')(
  {
    db: uhtDb,
    buildSearchRecord
  }
);
const academyCouncilTaxSearchGateway = require('./gateways/Academy-CouncilTax/Search')(
  {
    db: academyDb,
    buildSearchRecord
  }
);
const uhwSearchGateway = require('./gateways/UHW/Search')({
  db: uhwDb,
  buildSearchRecord
});
const singleViewSearchGateway = require('./gateways/SingleView/Search')({
  db: singleViewDb,
  buildSearchRecord
});

// DOCUMENT GATEWAYS

const cominoFetchDocumentsGateway = require('./gateways/Comino/FetchDocuments')(
  {
    buildDocument,
    db: cominoDb
  }
);
const academyBenefitsFetchDocumentsGateway = require('./gateways/Academy-Benefits/FetchDocuments')(
  {
    db: academyDb,
    buildDocument,
    cominoFetchDocumentsGateway
  }
);
const uhwFetchDocumentsGateway = require('./gateways/UHW/FetchDocuments')({
  db: uhwDb,
  buildDocument
});
const jigsawFetchDocumentsGateway = require('./gateways/Jigsaw/FetchDocuments')(
  {
    buildDocument,
    doJigsawGetRequest,
    doJigsawPostRequest
  }
);
const academyCouncilTaxFetchDocumentsGateway = require('./gateways/Academy-CouncilTax/FetchDocuments')(
  {
    cominoFetchDocumentsGateway
  }
);

// RECORDS GATEWAYS

const academyBenefitsFetchRecordsGateway = require('./gateways/Academy-Benefits/FetchRecord')(
  {
    db: academyDb,
    buildNote
  }
);

const uhtContactsFetchRecordsGateway = require('./gateways/UHT-Contacts/FetchRecord')(
  {
    db: uhtDb,
    buildNote
  }
);

const uhtHousingRegisterFetchRecordsGateway = require('./gateways/UHT-HousingRegister/FetchRecord')(
  {
    db: uhtDb,
    buildNote
  }
);

const academyCouncilTaxFetchRecordsGateway = require('./gateways/Academy-CouncilTax/FetchRecord')(
  {
    db: academyDb
  }
);

const uhwFetchRecordsGateway = require('./gateways/UHW/FetchRecord')({
  db: uhwDb
});

const jigsawFetchRecordsGateway = require('./gateways/Jigsaw/FetchRecord')({
  doJigsawGetRequest,
  doGetRequest
});

// NOTES GATEWAYS

const cominoFetchNotesGateway = require('./gateways/Comino/FetchNotes')({
  buildNote,
  db: cominoDb
});
const academyBenefitsFetchNotesGateway = require('./gateways/Academy-Benefits/FetchNotes')(
  {
    db: academyDb,
    buildNote,
    cominoFetchNotesGateway
  }
);
const uhtContactsFetchNotesGateway = require('./gateways/UHT-Contacts/FetchNotes')(
  {
    db: uhtDb,
    buildNote
  }
);
const uhtHousingRegisterFetchNotesGateway = require('./gateways/UHT-HousingRegister/FetchNotes')(
  {
    db: uhtDb,
    buildNote
  }
);
const academyCouncilTaxFetchNotesGateway = require('./gateways/Academy-CouncilTax/FetchNotes')(
  {
    cominoFetchNotesGateway
  }
);
const uhwFetchNotesGateway = require('./gateways/UHW/FetchNotes')({
  db: uhwDb,
  buildNote
});
const jigsawFetchNotesGateway = require('./gateways/Jigsaw/FetchNotes')({
  doJigsawGetRequest,
  doGetRequest,
  buildNote
});

//document image gateways
const fetchDocumentImage = require('./gateways/Jigsaw/FetchDocumentImage')({
  doGetDocRequest,
  login
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
    [Systems.JIGSAW]: jigsawFetchRecordsGateway,
    [Systems.SINGLEVIEW]: vulnerabilitiesGateway
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
    [Systems.JIGSAW]: jigsawFetchNotesGateway,
    [Systems.SINGLEVIEW]: vulnerabilitiesGateway
  },
  getCustomerLinks
});

const addVulnerability = require('./use-cases/AddVulnerability')({
  gateway: vulnerabilitiesGateway
});

const getJigsawDocument = require('./use-cases/FetchJigsawDocument')({
  jigsawDocGateway: fetchDocumentImage,
  jigsawMetadataGateway: jigsawFetchDocumentsGateway
});

module.exports = {
  addVulnerability,
  customerSearch,
  fetchDocuments,
  fetchRecords,
  fetchNotes,
  getJigsawDocument
};
