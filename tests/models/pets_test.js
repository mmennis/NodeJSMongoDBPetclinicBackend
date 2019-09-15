const assert = require('assert');
const helper = require('../test_helper');
const Owner = require('../../models/owners');
const Pet = require('../../models/pets');

describe('Pets model', () => {

    let owner;

    beforeEach((done) => {
        helper();
        owner = new Owner({
            first_name: 'Pet',
            last_name: 'Owner',
            address: '1234 Canine Lane',
            city: 'Dogtown',
            state: 'CA',
            telephone: '408-555-1212'
        });
        owner.save()
            .then(() => {
                //console.log('Pets before each save owner');
                done();
            })
            .catch((err) => {
                console.error('beforeEach - problem saving owner');
                done();
            });
    })

    afterEach((done) => {
        Owner.findByIdAndRemove(owner._id, function(err, res) {
            if (err) {
                console.error(`AFTER each - ${err}`)
            }
            done();
        });
    });

    it('should save a pet with an owner but no visits ', (done) => {
        const pet = new Pet({
            name: 'fido no visits',
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
                console.error(`CREATE no visits - ${err}`);
                done();
            });
    });

    it('should save a pet with an owner but empty visits ', (done) => {
        const pet = new Pet({
            name: 'fido no visits',
            owner: owner,
            pet_type: 'dog',
            visits: []
        });
        pet.save()
            .then(() => {
                //console.log('Saved pet');
                assert(!pet.isNew);
                assert(pet.visits.length === 0);
                done();
            })
            .catch((err) => {
                console.error(`CREATE empty visits - ${err}`);
                done();
            });
    });

    describe('with pets and visits', () => {
        let pet;
        beforeEach((done) => {
            pet = new Pet({
                name: 'fido with visits',
                owner: owner,
                pet_type: 'dog',
                visits: [
                    {
                        visit_date: Date.now(),
                        reason: 'Sore paw',
                        vet: null,
                    }
                ]
            });
            pet.save()
                .then(() => {
                    assert(!pet.isNew);
                    done();    
                })
                .catch((err) => {
                    console.error(`CREATE pet - ${err}`);
                    done();
                });
        })

        afterEach((done) => {
            Pet.deleteMany({}, function(err, res) {
                if (err) {
                    console.error(`AFTER each - ${err}`);
                }
                done();
            });
        });

        it('should find a pet by name', (done) => {
            Pet.find({ name: pet.name }, (err, results) => {
                if(err) { console.log(`FIND by name - ${err}`)}
                assert(results.length > 0);
                assert(results[0].name === pet.name);
                done();
            })
        })

        it('should find all pets', (done) => {
            Pet.find({}, (err, results) => {
                if(err) { console.log(`FIND all - ${err}`)}
                assert(results.length > 0);
                assert(results[0].name === pet.name);
                done();
            });
        })

        it('should find pet by id', (done) => {
            Pet.findById(pet._id, (err, result) => {
                if(err) { console.log(`FIND by id - ${err}`)}
                assert((pet._id).equals(result._id));
                done();
            })
        })

        it('should save a pet with owner and visits', (done) => {
            Pet.findById(pet._id)
                .then((savedPet) => {
                    assert((pet._id).equals(savedPet._id));
                    assert(savedPet.visits.length > 0);
                    done();
                })
                .catch((err) => {
                    console.log(`CREATE with visits - ${err}`);
                    done();
                });
        });  
        
        it('should remove a pet by id', (done) => {
            Pet.findByIdAndRemove(pet._id, (err, res) => {
                if(err) {
                    console.error(`REMOVE PET by id - ${err}`)
                }
                Pet.findById(pet._id, (err, res) => {
                    assert(res === null);  // pet is now missing
                })
                done();
            })
        });

        it('should update a pet', (done) => {
            assert(pet.name !== 'Rover');
            Pet.findByIdAndUpdate(pet._id, { name: 'Rover'}, { new: true }, (err, res) => {
                assert(res.name === 'Rover');
                assert((res._id).equals(pet._id));
                done();
            })
        });

        it('should update a pet with new visit', (done) => {
            let visit = {
                    visit_date: Date.now(),
                    reason: 'blind',
                    vet: null,
            }
            Pet.findByIdAndUpdate(pet._id, 
                { $push: { visits: visit }}, 
                { new: true }, 
                (err, res) => {
                if(err) { console.error(`UPDATE with new visit ${err}`)}
                assert((res._id).equals(pet._id));
                assert(res.visits.length > 1);
                assert(res.visits[1].reason === 'blind');
                done();
            })
        })

        it('should update a pet to remove a visit', (done) => {
            const visitId = pet.visits[0]._id ;
            Pet.findByIdAndUpdate(pet._id, 
                { $pull: { visits: { $elemMatch: { _id : visitId } } } }, 
                { new: true, safe: true }, 
                (err, res) => {
                    if(err) { console.error(`UPDATE remove visit ${err}`)}
                    assert(res.visits.length === 0);
                    done();
                });
        })
    });

});