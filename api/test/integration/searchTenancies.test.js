const { doGetRequest } = require('./TestUtils')

describe('Search for Tenancies', () => {
  it('Returns records from the tenancy api', async () => {
    const response = await doGetRequest(
      `tenancies?address=myaddressNumber1`
    );
    expect(response).toEqual({
      tenancies: [
        {
          tenancyAgreementReference:"000473/03",
          address:"3 Hillman Street",
          postcode:"E1 7HG",
          commencementOfTenancyDate:"2010-04-15",
          endOfTenancyDate: null,
          currentBalance:"34",
          present:true,
          terminated:false,
          paymentReference:"57757375849379",
          householdReference:"8265926",
          propertyReference:"734638256",
          tenureType:"SLL: Short Life Lse",
          agreementType:"M: Master Account",
          service:"3",
          otherCharge:"678",
          residents:[{firstName:"Tweeny",lastName:"Ed",dateOfBirth:"1967-05-17"}]
        },
        {
          tenancyAgreementReference:"526389/04",
          address:"2nd Floor Flat",
          postcode:"N6 TY7",
          commencementOfTenancyDate:"1987-10-17",
          endOfTenancyDate:null,
          currentBalance:"-451.38",
          present:true,
          terminated:false,
          paymentReference:"1072628478",
          householdReference:"005722",
          propertyReference:"0088273",
          tenureType:"SEC: Secure",
          agreementType:"M: Master Account",
          service:"19.7",
          otherCharge:"0.1",
          residents:[{firstName:"James",lastName:"Right",dateOfBirth:null}]
        }
      ]
    })
  });

  it('Will query for freeholder only tenancies', async () => {
    const response = await doGetRequest(
      `tenancies?address=greenstreet&freehold_only=true`
    );

    expect(response).toEqual({
      tenancies: [
        {
          tenancyAgreementReference:"526389/04",
          address:"1st Floor Flat",
          postcode:"E6 TY7",
          commencementOfTenancyDate:"2017-10-17",
          endOfTenancyDate:null,
          currentBalance:"-51.38",
          present:true,
          terminated:false,
          paymentReference:"1072628478",
          householdReference:"005722",
          propertyReference:"0088273",
          tenureType:"FRE: Freehold",
          agreementType:"M: Master Account",
          service:"19.7",
          otherCharge:"0.1",
          residents:[{firstName:"Janny",lastName:"Left",dateOfBirth:null}]
        }
      ]
    })
  })
});
