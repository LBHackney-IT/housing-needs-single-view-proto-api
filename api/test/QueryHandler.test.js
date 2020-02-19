const { mergeResponses } = require('../lib/QueryHandler');
describe('QueryHandler', () => {
  const responses = [
    {
      housingRegister: [
        {
          applicationRef: 'DIR0111111',
          biddingNo: '2157162',
          band: 'one',
          startDate: '01/06/2019'
        },
        {
          applicationRef: 'DIR0111112',
          biddingNo: '2157163',
          band: 'two',
          startDate: '01/03/2019'
        },
        {
          applicationRef: 'DIR0111113',
          biddingNo: '2157164',
          band: 'two',
          startDate: '03/01/2019'
        }
      ]
    },
    {
      housingRegister: {
        applicationRef: 'DIR0222222',
        biddingNo: '2157166',
        band: 'three',
        startDate: '02/01/2019'
      }
    },
    {
      housingRegister: [
        {
          applicationRef: 'DIR0333331',
          biddingNo: '2157120',
          band: 'one',
          startDate: '01/04/2019'
        },
        {
          applicationRef: 'DIR0333332',
          biddingNo: '2157154',
          band: 'two',
          startDate: '01/05/2019'
        },
        {
          applicationRef: 'DIR0333333',
          biddingNo: '2157133',
          band: 'three',
          startDate: '01/01/2019'
        }
      ]
    }
  ];

  const expected = {
    housingRegister: [
      {
        applicationRef: 'DIR0333333',
        biddingNo: '2157133',
        band: 'three',
        startDate: '01/01/2019'
      },
      {
        applicationRef: 'DIR0222222',
        biddingNo: '2157166',
        band: 'three',
        startDate: '02/01/2019'
      },
      {
        applicationRef: 'DIR0111113',
        biddingNo: '2157164',
        band: 'two',
        startDate: '03/01/2019'
      },
      {
        applicationRef: 'DIR0111112',
        biddingNo: '2157163',
        band: 'two',
        startDate: '01/03/2019'
      },
      {
        applicationRef: 'DIR0333331',
        biddingNo: '2157120',
        band: 'one',
        startDate: '01/04/2019'
      },
      {
        applicationRef: 'DIR0333332',
        biddingNo: '2157154',
        band: 'two',
        startDate: '01/05/2019'
      },
      {
        applicationRef: 'DIR0111111',
        biddingNo: '2157162',
        band: 'one',
        startDate: '01/06/2019'
      }
    ]
  };
  it('can merge housing registry applications', async () => {
    expect(mergeResponses(responses)).toStrictEqual(expected);
  });
});
