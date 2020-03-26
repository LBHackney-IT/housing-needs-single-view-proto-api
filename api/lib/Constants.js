const Systems = {
  SINGLEVIEW: 'SINGLEVIEW',
  UHT_CONTACTS: 'UHT-Contacts',
  UHT_HOUSING_REGISTER: 'UHT-HousingRegister',
  UHW: 'UHW',
  UHT_ACTION_DIARY: 'UHT-ActionDiary',
  JIGSAW: 'JIGSAW',
  ACADEMY_BENEFITS: 'ACADEMY-Benefits',
  ACADEMY_COUNCIL_TAX: 'ACADEMY-CouncilTax',
  COMINO: 'COMINO'
};

const IncomeFrequency = {
  0: 'N/A',
  1: 'Daily',
  2: 'Weekly',
  3: 'Monthly',
  4: 'Half-Yearly',
  5: 'Annually',
  14: 'Quarterly'
};

const HousingBands = {
  URG: 'Urgent',
  RES: 'Reserve',
  HOM: 'Homeless',
  PRY: 'Priority',
  GEN: 'General'
};

const MimeType = {
  Default: 'application/octet-stream',
  Html: 'text/html',
  Pdf: 'application/pdf',
  PlainText: 'text/plain'
};

module.exports = {
  Systems,
  IncomeFrequency,
  HousingBands,
  MimeType
};
