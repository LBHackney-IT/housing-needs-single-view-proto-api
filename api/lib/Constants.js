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

const ApplicationStatus = {
  800: 'Offer accepted',
  500: 'Offer withdrawn',
  600: 'Denied',
  901: 'Active and awaiting assessment',
  400: 'Shortlisted',
  102: 'Web application',
  100: 'Awaiting assessment',
  110: 'Not active and under appeal',
  300: 'Active',
  700: 'Under annual review',
  310: 'TA live',
  101: 'No data',
  301: 'Temporary accommodation live',
  320: 'Active and under appeal',
  900: 'Applicant rehoused',
  200: 'Cancelled'
}

module.exports = {
  Systems,
  IncomeFrequency,
  HousingBands,
  ApplicationStatus
};
