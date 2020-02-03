const { doJigsawGetRequest, jigsawEnv } = require('@lib/JigsawUtils');
const SqlServerConnection = require('@lib/SqlServerConnection');
const buildSearchRecord = require('@lib/entities/SearchRecord')();

const cleanRecord = require('@lib/use-cases/CleanRecord')({
  badData: {
    address: ['10 Elmbridge Walk, Blackstone Estate, London, E8 3HA'],
    dob: ['01/01/1900']
  }
});

const jigsawSearchGateway = require('@lib/gateways/Jigsaw/JigsawSearch')({
  doJigsawGetRequest,
  jigsawEnv,
  buildSearchRecord
});

const academyBenefitsSearchGateway = require('@lib/gateways/Academy-Benefits/AcademyBenefitsSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord
  }
);
const UHTContactsSearchGateway = require('@lib/gateways/UHT-Contacts/UHTContactsSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord
  }
);
const UHTHousingRegisterSearchGateway = require('@lib/gateways/UHT-HousingRegister/UHTHousingRegisterSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.UHT_DB
    }),
    buildSearchRecord
  }
);
const AcademyCouncilTaxSearchGateway = require('@lib/gateways/Academy-CouncilTax/AcademyCouncilTaxSearch')(
  {
    db: new SqlServerConnection({
      dbUrl: process.env.ACADEMY_DB
    }),
    buildSearchRecord
  }
);
const UHWSearchGateway = require('@lib/gateways/UHW/UHWSearch')({
  db: new SqlServerConnection({
    dbUrl: process.env.UHW_DB
  }),
  buildSearchRecord
});
const singleViewSearchGateway = require('@lib/gateways/SingleView/SingleViewSearch')(
  {
    db: require('@lib/PostgresDb'),
    buildSearchRecord
  }
);

const customerSearch = require('@lib/use-cases/CustomerSearch')({
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
  groupSearchRecords: require('@lib/use-cases/GroupSearchRecords')()
});

module.exports = {
  customerSearch
};
