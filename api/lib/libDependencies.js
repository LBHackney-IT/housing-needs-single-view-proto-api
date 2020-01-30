const { doJigsawGetRequest, jigsawEnv } = require('../lib/JigsawUtils');
const SqlServerConnection = require('./SqlServerConnection');
const jigsawSearchGateway = require('./gateways/Jigsaw/JigsawSearchGateway')({
  doJigsawGetRequest,
  jigsawEnv,
  buildSearchRecord: require('./entities/SearchRecord')()
});
const academyBenefitsSearchGateway = require('./gateways/Academy-Benefits/AcademyBenefitsSearchGateway')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord: require('./entities/SearchRecord')()
  }
);
const UHTContactsSearchGateway = require('./gateways/UHT-Contacts/UHTContactsSearchGateway')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord: require('./entities/SearchRecord')()
  }
);
const UHTHousingRegisterSearchGateway = require('./gateways/UHT-HousingRegister/UHTHousingRegisterSearchGateway')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord: require('./entities/SearchRecord')()
  }
);
const AcademyCouncilTaxSearchGateway = require('./gateways/Academy-CouncilTax/AcademyCouncilTaxSearchGateway')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord: require('./entities/SearchRecord')()
  }
);
const UHWSearchGateway = require('./gateways/UHW/UHWSearchGateway')({
  db: new SqlServerConnection({
    dbUrl: process.env.UHW_DB
  }),
  buildSearchRecord: require('./entities/SearchRecord')()
});
const singleViewSearchGateway = require('./gateways/SingleView/SingleViewSearchGateway')(
  {
    db: require('./PostgresDb'),
    buildSearchRecord: require('./entities/SearchRecord')()
  }
);
module.exports = {
  jigsawSearchGateway,
  academyBenefitsSearchGateway,
  UHTContactsSearchGateway,
  UHTHousingRegisterSearchGateway,
  AcademyCouncilTaxSearchGateway,
  UHWSearchGateway,
  singleViewSearchGateway
};
