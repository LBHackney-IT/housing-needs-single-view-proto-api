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
      });

      describe('searchPeopleAlertsReturns404', () => {
        beforeEach(() => {
          nock(baseUrl, {
            reqheaders: {
              'X-API-Key': apiKey
            }
          }).get('/api/v1/cautionary-alerts/people')
          .reply(404, { contacts: [] });
        });
    
        it('returns an empty array if there are no query parameters', async () => {
          const api = new CautionaryAlertsApi({
            baseUrl: baseUrl,
            apiKey: apiKey,
            logger: logger
          });

          const apiResponse = await api.searchPeopleAlerts({});
          expect(apiResponse.contacts.length).toBe(0);
          expect(logger.error).toHaveBeenCalledWith(
            'Error getting cautionary alerts for people: StatusCodeError: 404 - {\"contacts\":[]}',
            expect.anything()
          );
        });
      });

      describe('getAlertsForProperty', () => {
          const propertyRef = '000012712';
          beforeEach(() => {
            nock(baseUrl, {
              reqheaders: {
                  'X-API-Key': apiKey
              }
            }).get(`/api/v1/cautionary-alerts/properties/${propertyRef}`)
            .reply(200, propertyResponse);
          });
    
          it('calls the API endpoint with valid parameters', async () => {
            const api = new CautionaryAlertsApi({
              baseUrl: baseUrl,
              apiKey: apiKey,
              logger: logger
            });
            
            const apiResponse = await api.getAlertsForProperty(propertyRef);
            expect(apiResponse).toEqual(propertyResponse);
            expect(nock.isDone()).toBe(true);
          });

        });

        describe('getAlertsForPropertyReturns404', () => {
          const propertyRef = '';
          beforeEach(() => {
            nock(baseUrl, {
              reqheaders: {
                  'X-API-Key': apiKey
              }
            }).get(`/api/v1/cautionary-alerts/properties/${propertyRef}`)
            .reply(404, { alerts: []});
          });
      
          it('returns an empty array if there are no query parameters', async () => {
            const api = new CautionaryAlertsApi({
              baseUrl: baseUrl,
              apiKey: apiKey,
              logger: logger
            });
  
            const apiResponse = await api.getAlertsForProperty('');
            expect(apiResponse.alerts.length).toBe(0);
            expect(logger.error).toHaveBeenCalledWith(
              'Error getting cautionary alerts for property: StatusCodeError: 404 - {\"alerts\":[]}',
              expect.anything()
            );
          });
        });
});
