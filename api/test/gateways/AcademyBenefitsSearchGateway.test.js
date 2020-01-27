describe('Academy Benefits Search Gateway', () => {
    let db;

    beforeEach(() => {
        db = {
            request: jest.fn()
        }

        academyBenefitsSearchGateway = require('../../lib/gateways/AcademyBenefitsSearchGateway')({ db });

    });

    it('if the query contains firstname then the db is queried for forename', () => {
        const firstName = 'maria'
        const queryMatcher = expect.stringMatching(/forename LIKE @forename/);
        const paramMatcher = expect.arrayContaining([expect.objectContaining({ value: `%${firstName.toUpperCase()}%` })]);
        academyBenefitsSearchGateway.execute({ firstName });
        expect(db.request).toHaveBeenCalledWith(queryMatcher, paramMatcher);
    })

    it('if the query does not have a firstname then the db is not queried for the forename', () => {
        const queryMatcher = expect.not.stringMatching(/forename LIKE @forename/);
        academyBenefitsSearchGateway.execute({ });
        expect(db.request).toHaveBeenCalledWith(queryMatcher, expect.anything());
    })

    // it('if the query contains lastname then the db is queried for lastname', () => {
    //     academyBenefitsSearchGateway.execute({ lastName: 'smith' });
    //     expect(db.request).toHaveBeenCalledWith(expect.stringMatching(/lastname/), expect.objectContaining({ value: 'smith' }));
    // })
})