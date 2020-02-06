const {
  doJigsawGetRequest,
  jigsawEnv,
  doJigsawPostRequest
} = require('./JigsawUtils');
const SqlServerConnection = require('./SqlServerConnection');
const buildSearchRecord = require('./entities/SearchRecord')();
const academyDb = new SqlServerConnection({ dbUrl: process.env.ACADEMY_DB });
const uhtDb = new SqlServerConnection({ dbUrl: process.env.UHT_DB });
const uhwDb = new SqlServerConnection({ dbUrl: process.env.UHW_DB });
const cominoDb = new SqlServerConnection({ dbUrl: process.env.HN_COMINO_URL });

const cleanRecord = require('./use-cases/CleanRecord')({
  badData: {
    address: ['10 Elmbridge Walk, Blackstone Estate, London, E8 3HA'],
    dob: ['01/01/1900']
  }
});

const jigsawSearchGateway = require('./gateways/Jigsaw/Search')({
  doJigsawGetRequest,
  jigsawEnv,
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
  db: require('./PostgresDb'),
  buildSearchRecord
});

const customerSearch = require('./use-cases/CustomerSearch')({
  cleanRecord,
  gateways: [
    // jigsawSearchGateway,
    // academyBenefitsSearchGateway,
    // uhtContactsSearchGateway,
    // uhtHousingRegisterSearchGateway,
    // academyCouncilTaxSearchGateway,
    uhwSearchGateway,
    singleViewSearchGateway
  ],
  groupSearchRecords: require('./use-cases/GroupSearchRecords')()
});

//FetchDocuments
const buildDocument = require('./entities/Document')();
const postgresDb = require('./PostgresDb');
const getSystemId = require('./gateways/SingleView/SystemID')({
  db: postgresDb
});
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
  buildDocument
});

const jigsawFetchDocumentsGateway = require('./gateways/Jigsaw/FetchDocuments')(
  {
    buildDocument,
    doJigsawGetRequest,
    doJigsawPostRequest,
    getSystemId,
    jigsawEnv
  }
);

const academyCouncilTaxFetchDocumentsGateway = require('./gateways/Academy-CouncilTax/FetchDocuments')(
  {
    cominoFetchDocumentsGateway,
    getSystemId
  }
);

const fetchDocuments = require('./use-cases/FetchDocuments')({
  gateways: [
    // academyCouncilTaxFetchDocumentsGateway,
    // academyBenefitsFetchDocumentsGateway,
    // jigsawFetchDocumentsGateway,
    uhwFetchDocumentsGateway
  ]
});

module.exports = {
  customerSearch,
  fetchDocuments
};
