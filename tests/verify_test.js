const assert = require('assert');

describe('Verification of Test setup',() => {
    it('should verify basic arithmetic', (done) => {
        assert((2 + 2) === 4);
        done();
    })
});