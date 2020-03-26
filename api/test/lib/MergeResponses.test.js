const mergeResponses = require('../../lib/MergeResponses');

describe ('MergeResponses', () => {
  const responses = [
    {
      housingRegister: [
        {
          applicationRef: 'DIR0111111',
          biddingNo: '2157162',
          band: 'one',
          startDate: new Date(2019, 5, 1),
          bedroomReq: '1',
          applicationStatus: 'Offer accepted'
        },
        {
          applicationRef: 'DIR0111112',
          biddingNo: '2157163',
          band: 'two',
          startDate: new Date(2019, 2, 1),
          bedroomReq: '2',
          applicationStatus: 'Offer withdrawn'
        },
        {
          applicationRef: 'DIR0111113',
          biddingNo: '2157164',
          band: 'two',
          startDate: new Date(2019, 0, 3),
          bedroomReq: '3',
          applicationStatus: 'Denied'
        }
      ]
    },
    {
      housingRegister: {
        applicationRef: 'DIR0222222',
        biddingNo: '2157166',
        band: 'three',
        startDate: new Date(2019, 0, 2),
        bedroomReq: '4',
        applicationStatus: 'Active and awaiting assessment'
      }
    },
    {
      housingRegister: [
        {
          applicationRef: 'DIR0333331',
          biddingNo: '2157120',
          band: 'one',
          startDate: new Date(2019, 3, 1),
          bedroomReq: '5',
          applicationStatus: 'Shortlisted'
        },
        {
          applicationRef: 'DIR0333332',
          biddingNo: '2157154',
          band: 'two',
          startDate: new Date(2019, 4, 1),
          bedroomReq: '6',
          applicationStatus: 'Web application'
        },
        {
          applicationRef: 'DIR0333333',
          biddingNo: '2157133',
          band: 'three',
          startDate: new Date(2019, 0, 1),
          bedroomReq: '7',
          applicationStatus: 'Awaiting assessment'
        }
      ]
    }
  ];
  const expected = {
    housingRegister: [
      {
        applicationRef: 'DIR0111111',
        biddingNo: '2157162',
        band: 'one',
        startDate: new Date(2019, 5, 1),
        bedroomReq: '1',
        applicationStatus: 'Offer accepted'
      },
      {
        applicationRef: 'DIR0333332',
        biddingNo: '2157154',
        band: 'two',
        startDate: new Date(2019, 4, 1),
        bedroomReq: '6',
        applicationStatus: 'Web application'
      },
      {
        applicationRef: 'DIR0333331',
        biddingNo: '2157120',
        band: 'one',
        startDate: new Date(2019, 3, 1),
        bedroomReq: '5',
        applicationStatus: 'Shortlisted'
      },
      {
        applicationRef: 'DIR0111112',
        biddingNo: '2157163',
        band: 'two',
        startDate: new Date(2019, 2, 1),
        bedroomReq: '2',
        applicationStatus: 'Offer withdrawn'
      },
      {
        applicationRef: 'DIR0111113',
        biddingNo: '2157164',
        band: 'two',
        startDate: new Date(2019, 0, 3),
        bedroomReq: '3',
        applicationStatus: 'Denied'
      },
      {
        applicationRef: 'DIR0222222',
        biddingNo: '2157166',
        band: 'three',
        startDate: new Date(2019, 0, 2),
        bedroomReq: '4',
        applicationStatus: 'Active and awaiting assessment'
      },
      {
        applicationRef: 'DIR0333333',
        biddingNo: '2157133',
        band: 'three',
        startDate: new Date(2019, 0, 1),
        bedroomReq: '7',
        applicationStatus: 'Awaiting assessment'
      }
    ]
  };

  it('can merge housing registry applications', async () => {
    expect(mergeResponses(responses)).toStrictEqual(expected);
  });
});