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
const {
  doJigsawGetRequest,
  doJigsawPostRequest,
  doGetRequest
} = require('./JigsawUtils');
const getSystemId = require('./gateways/SingleView/SystemID')({
  db: singleViewDb
});

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
    cominoFetchDocumentsGateway,
    getSystemId
  }
);
const uhwFetchDocumentsGateway = require('./gateways/UHW/FetchDocuments')({
  db: uhwDb,
  buildDocument,
  getSystemId
});
const jigsawFetchDocumentsGateway = require('./gateways/Jigsaw/FetchDocuments')(
  {
    buildDocument,
    doJigsawGetRequest,
    doJigsawPostRequest,
    getSystemId
  }
);
const academyCouncilTaxFetchDocumentsGateway = require('./gateways/Academy-CouncilTax/FetchDocuments')(
  {
    cominoFetchDocumentsGateway,
    getSystemId
  }
);

// NOTES GATEWAYS

const cominoFetchNotesGateway = require('./gateways/Comino/FetchNotes')({
  buildNote,
  db: cominoDb
});

const academyBenefitsFetchNotesGateway = require('./gateways/Academy-Benefits/FetchNotes')(
  {
    db: academyDb,
    buildNote,
    cominoFetchNotesGateway,
    getSystemId
  }
);
const uhtContactsFetchNotesGateway = require('./gateways/UHT-Contacts/FetchNotes')(
  {
    db: uhtDb,
    buildNote,
    getSystemId
  }
);

const uhtHousingRegisterFetchNotesGateway = require('./gateways/UHT-HousingRegister/FetchNotes')(
  {
    db: uhtDb,
    buildNote,
    getSystemId
  }
);

const academyCouncilTaxFetchNotesGateway = require('./gateways/Academy-CouncilTax/FetchNotes')(
  {
    cominoFetchNotesGateway,
    getSystemId
  }
);

const uhwFetchNotesGateway = require('./gateways/UHW/FetchNotes')({
  db: uhwDb,
  buildNote,
  getSystemId
});

const jigsawFetchNotesGateway = require('./gateways/Jigsaw/FetchNotes')({
  getSystemId,
  doJigsawGetRequest,
  doGetRequest,
  buildNote
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
  gateways: [
    academyCouncilTaxFetchDocumentsGateway,
    academyBenefitsFetchDocumentsGateway,
    jigsawFetchDocumentsGateway,
    uhwFetchDocumentsGateway
  ]
});

const fetchNotes = require('./use-cases/FetchNotes')({
  gateways: [
    academyBenefitsFetchNotesGateway,
<<<<<<< HEAD
    jigsawFetchNotesGateway,
    uhwFetchNotesGateway
=======
    uhtHousingRegisterFetchNotesGateway,
    academyCouncilTaxFetchNotesGateway,
    jigsawFetchNotesGateway,
    uhtContactsFetchNotesGateway
>>>>>>> origin/notes-gateways
  ]
});

module.exports = {
  customerSearch,
  fetchDocuments,
  fetchNotes
};
