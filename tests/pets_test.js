const assert = require('assert');
const helper = require('./test_helper');
const Owner = require('../models/owners');
const Pet = require('../models/pets');

describe('Pets model', () => {

    let owner;

    beforeEach((done) => {
        helper();
        owner = new Owner({
            first_name: 'Pet',
            last_name: 'Owner',
            address: '1234 Canine Lane',
            city: 'Dogtown',
            telephone: '408-555-1212'
        });
        owner.save()
            .then(() => {
                console.log('Pets before each save owner');
                done();
            })
            .catch((err) => {
                console.error('beforeEach - problem saving owner');
                done();
            });
    })

    afterEach((done) => {
        Owner.deleteMany({}, (err) => {
            if(err) {
                console.error(`Problem deleteing existing owners ${err}`);
                done();
            }
        });
        Pet.deleteMany({}, (err) => {
            if (err) {
                console.error(`Problem deleting the pets from the database ${err}`);
                done();
            }
            done();
        })
    });

    it('should save a pet with an owner but no visits ', (done) => {
        const pet = new Pet({
            name: 'fido',
            owner: owner,
            pet_type: 'dog'
        });
        pet.save()
            .then(() => {
                //console.log('Saved pet');
                assert(!pet.isNew);
                done();
            })
            .catch((err) => {
                console.error(`Problem saving the pet ${err}`);
                done();
            });
    });

});