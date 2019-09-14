const assert = require('assert');
const helper = require('../test_helper')
const Vet = require('../../models/vets');
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
        done();
    });

    afterEach((done) => {
        Vet.findByIdAndRemove(vet._id, (err) => {
            if (err) {
                console.error(`AFTER all - ${err}`);
            }
            done();
        });
    })

    it('should create a vet', (done) => {
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

        it('should update a vet', (done) => {
            assert(vet.last_name !== 'UpdatedName');
            Vet.findByIdAndUpdate(vet._id, {last_name: 'UpdatedName'} ,{ new :true}, (err, res) => {
                if(err) { console.error(`UPDATE - ${err}`)}
                assert((vet._id).equals(res._id));
                assert(res.last_name = 'UpdatedName');
                done();
            })
        })

        it('should remove a vet by id', (done) => {
            Vet.deleteOne({ '_id': vet._id }, (err) => {
                if (err) { console.error(`DELETE by id ${err}`)}
                Vet.findById(vet._id, (err, res) => {
                    assert(res === null)
                    done();
                })
            })
        })

    });
})