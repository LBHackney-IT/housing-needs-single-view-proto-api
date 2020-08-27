const nock = require('nock');
const CautionaryAlertsApi = require('../../../lib/gateways/CautionaryAlerts/CautionaryAlertsApi');

describe('CautionaryAlertsApiGateway', () => {

    let  logger = {
      error: jest.fn((msg, err) => {})
    };
    const apiKey = 'a-really-secure-token';
    const baseUrl = 'https://universal-housing.com';

    const propertyResponse = {
        alerts: [
            {
              dateModified: "2019-06-30",
              modifiedBy: "LSAMBA",
              startDate: "2019-03-30",
              endDate: "2020-01-13",
              alertCode: "VA",
              description: "Verbal abuse or threat of"
            }
          ],
          propertyReference: "000012712",
          uprn: "7498659",
          addressNumber: "345"
    }
    const peopleResponse = {
        contacts: [
            {
              tenancyAgreementReference: "7498659",
              personNumber: "4",
              contactNumber: "67",
              alerts: [
                {
                  dateModified: "2019-06-30",
                  modifiedBy: "LSAMBA",
                  startDate: "2019-03-30",
                  endDate: "2020-01-13",
                  alertCode: "VA",
                  description: "Verbal abuse or threat of"
                }
              ]
            }
          ]
      }

      describe('searchPeopleAlerts', () => {
        beforeEach(() => {
          nock(baseUrl, {
            reqheaders: {
              'X-API-Key': apiKey
            }
          }).get('/api/v1/cautionary-alerts/people')
          .query({tag_ref: '111111', person_number: '23'})
          .reply(200, peopleResponse);
        });
    
        it('calls the API endpoint with valid parameters', async () => {
          const api = new CautionaryAlertsApi({
            baseUrl: baseUrl,
            apiKey: apiKey,
            logger: logger
          });

          const apiResponse = await api.searchPeopleAlerts({tagRef: '111111', personNumber: '23'});
          expect(apiResponse).toEqual(peopleResponse);
          expect(nock.isDone()).toBe(true);
        });
    
        /*it('returns an empty array if error', async () => {
            const api = new CautionaryAlertsApi({
                baseUrl: baseUrl,
                apiKey: apiKey,
                logger: logger
              });
              
              const apiResponse = await api.searchPeopleAlerts({tagRef: '111111', personNumber: '-2'});
    
          expect(snapshotIds).toStrictEqual([]);
        });*/
      });

      describe('searchPropertyAlerts', () => {
          const propertyRef = '1234567890';
          
          beforeEach(() => {
            nock(baseUrl, {
              reqheaders: {
                  'X-API-Key': apiKey
              }
            }).get(`api/v1/cautionary-alerts/properties/${propertyRef}`)
              .reply(200, peopleResponse);
          });
    
        /*it('calls the API endpoint with valid body', async () => {
          const api = new VulnerabilitiesApi({
            baseUrl: 'https://vulnerabilities'
          });
          const { snapshotIds } = await api.find({
            token: expectedToken,
            firstName: 'Stanley',
            lastName: 'McTest',
            systemIds: ['123', '456']
          });
    
          expect(snapshotIds).toStrictEqual(expectedResponse.snapshotIds);
          expect(nock.isDone()).toBe(true);
        });*/

      });


});
