const { doJigsawGetRequest, jigsawEnv } = require('./JigsawUtils');
const SqlServerConnection = require('./SqlServerConnection');
const buildSearchRecord = require('./entities/SearchRecord')();

const cleanRecord = require('./use-cases/CleanRecord')({
  badData: {
    address: ['10 Elmbridge Walk, Blackstone Estate, London, E8 3HA'],
    dob: ['01/01/1900']
  }
});

const jigsawSearchGateway = require('./gateways/Jigsaw/JigsawSearch')({
  doJigsawGetRequest,
  jigsawEnv,
  buildSearchRecord
});

const academyBenefitsSearchGateway = require('./gateways/Academy-Benefits/AcademyBenefitsSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord
  }
);
const UHTContactsSearchGateway = require('./gateways/UHT-Contacts/UHTContactsSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord
  }
);
const UHTHousingRegisterSearchGateway = require('./gateways/UHT-HousingRegister/UHTHousingRegisterSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord
  }
);
const AcademyCouncilTaxSearchGateway = require('./gateways/Academy-CouncilTax/AcademyCouncilTaxSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord
  }
);
const UHWSearchGateway = require('./gateways/UHW/UHWSearch')({
  db: new SqlServerConnection({
    dbUrl: process.env.UHW_DB
  }),
  buildSearchRecord
});
const singleViewSearchGateway = require('./gateways/SingleView/SingleViewSearch')(
  {
    db: require('./PostgresDb'),
    buildSearchRecord
  }
);

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

module.exports = {
  customerSearch
};
