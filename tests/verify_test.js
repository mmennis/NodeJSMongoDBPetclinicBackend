const assert = require('assert');
const helper = require('./test_helper');

beforeEach((done) => {
    helper();
    done();
})

describe('Verification of Test setup',() => {
    it('should verify basic arithmetic', (done) => {
        assert((2 + 2) === 4);
        done();
    })
});