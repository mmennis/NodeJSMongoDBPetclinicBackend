const assert = require('assert');
const helper = require('./test_helper')
const Vet = require('../models/vets');
const faker = require('faker');

describe('Vets model', () => {

    let vet;
    beforeEach((done) => {
        helper();
        vet = new Vet({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            office_hours: '8:00 AM - 5:00 PM',
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber,
            specialty: 'surgery'
        });
        Vet.deleteMany({}, (err) => {
            if (err) {
                console.error(`CLEANUP before - ${err}`);
            }
            done();
        });
    })

    afterEach((done) => {
        Vet.findByIdAndDelete(vet._id, (err) => {
            if (err) {
                console.error(`AFTER all - ${err}`);
            }
            done();
        });
    })

    it('should crate a vet', (done) => {
        vet.save()
            .then(() => {
                assert(!vet.isNew)
                done();
            })
            .catch((err) => {
                console.error(`Create vet - ${err}`);
            });
    });

    describe('with vets persisted', () => {

        beforeEach((done) => {
            vet.last_name = 'SavedVet';
            vet.save().then(() => {
                assert(!vet.isNew);
                done();
            }).catch((err) => {
                console.error(`Before each - ${err}`);
            });
        });

        it('should find all vet', (done) => {
            Vet.find({})
                .then((vets) => {
                    assert(vets.length > 0);
                    assert(vets[0].last_name === 'SavedVet');
                    done();
                }).catch((err) => {
                    console.error(`FIND ALL - ${err}`);
                })
        });

        it('should find by last name', (done) => {
            Vet.find({ last_name: 'SavedVet' })
                .then((vets) => {
                    assert(vets.length > 0);
                    assert(vets[0].last_name === 'SavedVet');
                    done()
                }).catch((err) => {
                    console.error(`FIND last name - ${err}`);
                })
        });

        it('should find by id', (done) => {
            Vet.findById(vet._id)
                .then((foundVet) => {
                    assert((foundVet._id).equals(vet._id), true);
                    assert(foundVet.last_name === 'SavedVet');
                    done();
                })
                .catch((err) => {
                    console.error(`FIND by id - ${err}`);
                });
        })

    });
})