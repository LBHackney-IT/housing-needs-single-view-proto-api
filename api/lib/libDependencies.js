const {
  doJigsawGetRequest,
  jigsawEnv,
  doJigsawPostRequest
} = require('./JigsawUtils');
const SqlServerConnection = require('./SqlServerConnection');
const buildSearchRecord = require('./entities/SearchRecord')();

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
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord
  }
);
const UHTContactsSearchGateway = require('./gateways/UHT-Contacts/Search')({
  db: new SqlServerConnection({
    dbUrl: process.env.UHT_DB
  }),
  buildSearchRecord
});
const UHTHousingRegisterSearchGateway = require('./gateways/UHT-HousingRegister/Search')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord
  }
);
const AcademyCouncilTaxSearchGateway = require('./gateways/Academy-CouncilTax/Search')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord
  }
);
const UHWSearchGateway = require('./gateways/UHW/Search')({
  db: new SqlServerConnection({
    dbUrl: process.env.UHW_DB
  }),
  buildSearchRecord
});
const singleViewSearchGateway = require('./gateways/SingleView/Search')({
  db: require('./PostgresDb'),
  buildSearchRecord
});

const customerSearch = require('./use-cases/CustomerSearch')({
  cleanRecord,
  gateways: [
    jigsawSearchGateway,
    academyBenefitsSearchGateway,
    UHTContactsSearchGateway,
    UHTHousingRegisterSearchGateway,
    AcademyCouncilTaxSearchGateway,
    UHWSearchGateway,
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
    db: new SqlServerConnection({
      dbUrl: process.env.HN_COMINO_URL
    })
  }
);
const academyBenefitsFetchDocumentsGateway = require('./gateways/Academy-Benefits/FetchDocuments')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildDocument,
    cominoFetchDocumentsGateway,
    getSystemId
  }
);

const UHWFetchDocumentsGateway = require('./gateways/UHW/FetchDocuments')({
  db: new SqlServerConnection({
    dbUrl: process.env.UHW_DB
  }),
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
    academyCouncilTaxFetchDocumentsGateway,
    academyBenefitsFetchDocumentsGateway,
    jigsawFetchDocumentsGateway,
    UHWFetchDocumentsGateway
  ]
});

module.exports = {
  customerSearch,
  fetchDocuments
};
