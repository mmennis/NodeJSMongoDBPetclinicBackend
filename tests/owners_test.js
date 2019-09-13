const assert = require('assert');
const helper = require('./test_helper');
const Owner = require('../models/owners');



describe('Owner model', () => {

    beforeEach((done) => {
        helper();
        Owner.deleteMany({}, (err) => {
            if(err) {
                console.error(`Problem deleteing existing owners ${err}`);
                done();
            }
            done();
        });
    })
    
    afterEach((done) => {
        done();
    });

    it('should create an owner with no pets', (done) => {
        const owner = new Owner({
            first_name: 'Michael',
            last_name: 'Mennis',
            address: '1600 Villa St Apt 140',
            city: 'Mountain View',
            telephone: '408-555-1212'
        });
        owner.save()
            .then(() => {
                assert(!owner.isNew);
                done();
            })
            .catch((err) => {
                console.error(`Problem saving the owner ${err}`);
                done();
            });
    });


    it('should create an owner with empty pets', (done) => {
        var owner = new Owner({
            first_name: 'Mike',
            last_name: 'Mennis',
            address: '1600 Villa St',
            city: 'Mountain View',
            telephone: '408-555-1212',
            pets: []
        });
        owner.save()
            .then(() => {
                assert(!owner.isNew);
                done();
            })
            .catch((err) => {
                console.error(`Problem saving the owner ${err}`);
                done();
            });
    });

});