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
          bedroomReq: '1'
        },
        {
          applicationRef: 'DIR0111112',
          biddingNo: '2157163',
          band: 'two',
          startDate: new Date(2019, 2, 1),
          bedroomReq: '2'
        },
        {
          applicationRef: 'DIR0111113',
          biddingNo: '2157164',
          band: 'two',
          startDate: new Date(2019, 0, 3),
          bedroomReq: '3'
        }
      ]
    },
    {
      housingRegister: {
        applicationRef: 'DIR0222222',
        biddingNo: '2157166',
        band: 'three',
        startDate: new Date(2019, 0, 2),
        bedroomReq: '4'
      }
    },
    {
      housingRegister: [
        {
          applicationRef: 'DIR0333331',
          biddingNo: '2157120',
          band: 'one',
          startDate: new Date(2019, 3, 1),
          bedroomReq: '5'
        },
        {
          applicationRef: 'DIR0333332',
          biddingNo: '2157154',
          band: 'two',
          startDate: new Date(2019, 4, 1),
          bedroomReq: '6'
        },
        {
          applicationRef: 'DIR0333333',
          biddingNo: '2157133',
          band: 'three',
          startDate: new Date(2019, 0, 1),
          bedroomReq: '7'
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
        bedroomReq: '1'
      },
      {
        applicationRef: 'DIR0333332',
        biddingNo: '2157154',
        band: 'two',
        startDate: new Date(2019, 4, 1),
        bedroomReq: '6'
      },
      {
        applicationRef: 'DIR0333331',
        biddingNo: '2157120',
        band: 'one',
        startDate: new Date(2019, 3, 1),
        bedroomReq: '5'
      },
      {
        applicationRef: 'DIR0111112',
        biddingNo: '2157163',
        band: 'two',
        startDate: new Date(2019, 2, 1),
        bedroomReq: '2'
      },
      {
        applicationRef: 'DIR0111113',
        biddingNo: '2157164',
        band: 'two',
        startDate: new Date(2019, 0, 3),
        bedroomReq: '3'
      },
      {
        applicationRef: 'DIR0222222',
        biddingNo: '2157166',
        band: 'three',
        startDate: new Date(2019, 0, 2),
        bedroomReq: '4'
      },
      {
        applicationRef: 'DIR0333333',
        biddingNo: '2157133',
        band: 'three',
        startDate: new Date(2019, 0, 1),
        bedroomReq: '7'
      }
    ]
  };

  it('can merge housing registry applications', async () => {
    expect(mergeResponses(responses)).toStrictEqual(expected);
  });
});