const assert = require('assert');
const helper = require('../test_helper');
const Owner = require('../../models/owners');
const Pet = require('../../models/pets');

const faker = require('faker');

describe('Owner model', () => {

    let owner;

    beforeEach((done) => {
        helper();
        owner = new Owner({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber(),
            pets: []
        });
        done();
    })
    
    afterEach((done) => {
        Owner.findByIdAndRemove(owner._id, (err) => {
            if (err) {
                console.error(`Problem deleting owner created - ${err}`);
            }
            done();
        });
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

        it('should Remove an owner', (done) => {
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
            owner.last_name = 'OwnerWithPet';
            owner.save()
            .then(() => {
                assert(!owner.isNew);
            })
            .catch((err) => {
                console.error(`Problem saving the owner ${err}`);
            });
            pet = new Pet({
                name: 'fido',
                owner: owner,
                pet_type: 'dog'
            });
            pet.save()
                .then(() => {
                    done();
                })
                .catch((err) => {
                    console.log(`Problem saving pet for owner ${err}`);
                    done();
                });
        })

        afterEach((done) => {
            Pet.deleteMany({}, (err) => {
                if (err) {
                    console.error(`Problem deleting pet - ${err}`);
                }
                done();
            })
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

        it('should delete an owner and pet', (done) => {
            owner.pets = [],
            owner.last_name = 'Petowner';
            owner.pets.push(pet);
            owner.save()
                .then(() => {
                    assert(!owner.isNew);
                })
                .catch((err) => {
                    console.error(`Problem saving owner with pet ${err}`);
                });
           assert(owner !== null);
           assert(pet !== null);
           Owner.deleteMany({'_id' : owner._id}, (err) => {});
           Pet.find({ owner: owner._id}, (p) => {
               assert(p === null);
           })
           done();
        });

        it('should update with a new pet', (done) => {
            assert(owner.pets.length === 0);
            Owner.findByIdAndUpdate(owner._id, 
                { $push: { pets: pet }}, 
                { new : true},
                (err, newOwner) => {
                if(err) {
                    console.log(`UPDATE with new pet - ${err}`);
                }
                assert(newOwner.pets.length > 0);    
                assert((newOwner.pets[0]._id).equals(pet._id))
            });
            done();
        });
    }); // with pets

    describe('testing removal of a pet', () => {
        let pt;
        let ownr
        beforeEach((done) => {
            ownr = new Owner({
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.stateAbbr(),
                telephone: faker.phone.phoneNumber(),
                pets: []
            });
            pt = new Pet({
                name: 'fido',
                owner: owner,
                pet_type: 'dog'
            });
            pt.save()
                .then(() => {
                    assert(!pt.isNew);
                })
                .catch((err) => { console.log(`Problem saving pet for ownr ${err}`) });
            ownr.pets = [];
            ownr.pets.push(pt);
            ownr.save()
                .then(() => {
                    assert(!ownr.isNew);
                    done();
                })
                .catch((err) => { console.error(`Problem saving the owner ${err}`) });
        })
        
        afterEach((done) => {
            Owner.deleteMany({}, (err) => { if (err) console.error(`After each $[err]`)});
            Pet.deleteMany({}, (err) => { if(err) console.error(`AFTER each ${err}`) });
            done();
        })

        it('should update owner to remove a pet by id', (done) => {
            const ptId = ownr.pets[0]._id;
            Owner.findByIdAndUpdate(ownr._id, 
                { $pull: { pets: { $elemMatch: { _id: ptId } } } }, 
                { new : true, safe: true },
                (err, res) => {
                    if(err) { console.error(`FIND by id update ${err}`)}
                    //assert(res.pets.length === ownr.pets.length -1);
                    assert((ownr._id).equals(res._id));
                    done();
            });
        })
    }); // removal of pet

});