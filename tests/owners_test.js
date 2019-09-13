const assert = require('assert');
const helper = require('./test_helper');
const Owner = require('../models/owners');
const Pet = require('../models/pets');


describe('Owner model', () => {

    let owner;

    beforeEach((done) => {
        helper();
        owner = new Owner({
            first_name: 'Michael',
            last_name: 'Mennis',
            address: '1600 Villa St Apt 140',
            city: 'Mountain View',
            telephone: '408-555-1212'
        });
        Owner.deleteMany({}, (err) => {
            if(err) {
                console.error(`Problem deleteing existing owners ${err}`);
                done();
            }
            Pet.deleteMany({}, (err) => {
                if (err){
                    console.error(`Problem deleting pets from database ${err}`);
                    done();
                }
            })
            done();
        });
    })
    
    afterEach((done) => {
        done();
    });

    it('should create an owner with no pets', (done) => {
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
        owner.pets = [];
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

    describe('with owners saved', () => {
        beforeEach((done) => {
            owner.last_name = 'SavedOwner';
            owner.save()
            .then(() => {
                assert(!owner.isNew);
                done();
            })
            .catch((err) => {
                console.error(`Problem saving the owner ${err}`);
                done();
            });
            //console.log(`Owner Id: ${owner._id}`);
        });

        it('should find all owners', (done) => {
            Owner.find({})
                .then((owners) => {
                    assert(owners.length > 0);
                    assert(owners[0].last_name === owner.last_name);
                    done();
                })
                .catch((err) => {
                    console.error(`FIND all - Problem retrieving all owners from database ${err}`);
                    done();
                });
        });

        it('should find an owner by last_name', (done) => {
            Owner.find({ last_name: owner.last_name})
                .then((owners) => {
                    assert(owners.length > 0);
                    assert(owners[0].last_name === owner.last_name);
                    done();
                })
                .catch((err) => {
                    console.error(`FIND last_name - Problem retrieving all owners from database ${err}`);
                    done();
                });
        });

        it('should find an owner by id', (done) => {
            //console.log(`SEEKING Owner Id: ${owner._id}`);
            Owner.findById(owner._id)
                .then((foundOwner) => {
                    //assert.equal(foundOwner._id, owner._id);
                    assert(foundOwner.last_name === owner.last_name);
                    done();
                })
                .catch((err) => {
                    console.error(`FIND by id - Problem retrieving all owners from database ${err}`);
                    done();
                });
        });

        it('should update owner by id in the database', (done) => {
            Owner.findByIdAndUpdate(owner._id, {first_name: 'Changed', last_name: 'Name'})
                .then((retOwner) => {
                    Owner.findById(owner._id,)
                        .then((newOwner) => {
                            assert(newOwner.first_name === 'Changed')
                            assert(newOwner.last_name === 'Name');
                            assert((newOwner._id).equals(owner._id), true);
                            done();
                        })
                        .catch((err) => {
                            console.error(`UPDATE test - Problem finding owner with id ${owner._id}: ${err}`);
                            done();
                        });
                    
                })
                .catch((err) => {
                    console.error(`UPDATE test - Problem updating owner ${err}`);
                    done();
                });
        });

        it('should delete an owner', (done) => {
            Owner.findByIdAndRemove(owner._id)
                .then((deletedOwner) => {
                    Owner.findById(owner._id)
                        .then((hasOwner) => {
                            assert(hasOwner === null);
                            done();
                        })
                        .catch((err) => {
                            console.error(`FIND deletedId - Problem retrieving owners from DB ${err}`);
                            done();
                        });
                })
                .catch((err) => {
                    console.error(`DELETE byId - Problem deleteing by id: ${err}`);
                });
        });
    }); // with saved owners

    describe('with pets', () => {

        let pet;

        beforeEach((done) => {
            Pet.deleteMany({}, (err) => {
                if(err) {
                    console.log(`Problem deleting all pets from database ${err}`);
                    done();
                }
            });
            pet = new Pet({
                name: 'fido',
                owner: owner,
                pet_type: 'dog'
            });
            pet.save()
                .then(() => {
                    //console.log('Saved pet for owner');
                    done();
                })
                .catch((err) => {
                    console.log(`Problem saving pet for owner ${err}`);
                    done();
                });
        })

        it('should create an owner with a pet', (done) => {
            owner.pets = [];
            owner.last_name = 'Petowner';
            owner.pets.push(pet);
            owner.save()
                .then(() => {
                    assert(!owner.isNew);
                    assert(owner.pets.length > 0);
                    assert(owner.pets[0].name === pet.name);
                    done();
                })
                .catch((err) => {
                    console.error(`Problem saving owner with pet ${err}`);
                    done();
                });
        });

        
    }); // with pets

});