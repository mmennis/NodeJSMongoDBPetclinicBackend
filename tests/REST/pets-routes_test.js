const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const faker = require('faker');
const should = chai.should();
chai.use(chaiHttp);

const Pet = require('../../models/pets');
const Owner = require('../../models/owners');
const Vet = require('../../models/vets');

describe('Pets REST api routes', () => {

    let owner;
    let pet;
    let vet;

    let petData;
    let ownerData;
    let vetData;

    beforeEach((done) => {
        ownerData = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber(),
            pets: []
        };
        owner = new Owner(ownerData);
        vetData = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            office_hours: '8:00 AM - 5:00 PM',
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber(),
            specialty: 'surgery'
        };
        vet = new Vet(vetData);
        petData = {
            name: 'fido',
            owner: owner,
            pet_type: 'dog',
            age: 15,
            visits: [
                {
                    visit_date: Date.now(),
                    reason: 'Sore paw',
                    vet: vet,
                }
            ]
        };
        pet = new Pet(petData);
        pet.save().then(() => {}); // for retrieval via GET
        done();
    })

    afterEach((done) => {
        Owner.deleteMany({}, (err) => {
            if(err) { console.error(`AFTER Each ${err}`)}
        })
        Pet.deleteMany({}, (err) => {
            if(err) { console.error(`AFTER Each ${err}`)}
            done();
        })
    })

    describe('GET pet data', () => {

        it('should GET All', (done) => {
            chai.request(server)
                .get('/pets/')
                .end((err, result) => {
                    if (err) { console.error(`GET all pets: ${err}`)}
                    assert(result.status === 200);
                    assert(result.body.data.length > 0);
                    assert((pet._id).equals(result.body.data[0]._id));
                    done();
                });
        })
    
        it('return a 404 when no id match', (done) =>{
            chai.request(server)
                .get('/pets/123456')
                .end((err, result) => {
                    assert(result.status === 404);
                    done();
                })
        })
    
        it('return a 200 and pet if id is matched', (done) => {
            chai.request(server)
                .get('/pets/' + pet._id)
                .end((err, result) => {
                    assert(result.status === 200);
                    assert((pet._id).equals(result.body.data._id));
                    done();
                });
        })
    }) // describe GET

    describe('GET filter pet data',() => {

        beforeEach((done) => {
            petData = {
                name: 'fido',
                owner: owner,
                pet_type: 'camel',
                age: 10,
                visits: [
                    {
                        visit_date: Date.now(),
                        reason: 'Sore paw',
                        vet: vet,
                    }
                ]
            };
            let newPet = new Pet(petData);
            newPet.save().then(() => {}); // for retrieval via GET
            done();
        })

        it('should filter by pet type', (done) => {
            chai.request(server)
                .get('/pets?pet_type=camel')
                .end((err, response) => {
                    if (err) { console.error(`GET filtered pets: ${err}`)}
                    assert(response.status === 200);
                    assert(response.body.data.length === 1);
                    assert(response.body.data[0].pet_type === 'camel');
                    done();
                });
        })

        it('should filter by pet type and name', (done) => {
            chai.request(server)
                .get('/pets?pet_type=camel&name=fido')
                .end((err, response) => {
                    if (err) { console.error(`GET filtered pets: ${err}`)}
                    assert(response.status === 200);
                    assert(response.body.data.length === 1);
                    assert(response.body.data[0].pet_type === 'camel');
                    assert(response.body.data[0].name === 'fido');
                    done();
                });
        })

        it('should filter by owner', (done) => {
            chai.request(server)
                .get('/pets?owner=' + owner._id)
                .end((err, response) => {
                    if (err) { console.error(`GET filtered pets: ${err}`)}
                    assert(response.status === 200);
                    assert(response.body.data.length === 2);
                    assert(response.body.data[1].pet_type === 'camel');
                    done();
                });
        })


        it('should filter by age equality', (done) => {
            chai.request(server)
                .get('/pets?age=15')
                .end((err, response) => {
                    if (err) { console.error(`GET filtered by age ${err}`)}
                    assert(response.body.data.length === 1);
                    assert(response.body.data[0].age === 15);
                    done();
                });
        })

        it('should filter by age > boolean operators', (done) => {
            chai.request(server)
                .get('/pets?age=>12')
                .end((err, response) => {
                    if (err) { console.error(`GET filtered by age ${err}`)}
                    assert(response.body.data.length === 1);
                    assert(response.body.data[0].age > 12);
                    done();
                });
        })

        it('should filter by age < boolean operators', (done) => {
            chai.request(server)
                .get('/pets?age=<10')
                .end((err, response) => {
                    if (err) { console.error(`GET filtered by age ${err}`)}
                    assert(response.body.data.length === 0);
                    done();
                });
        })
    }) // describe GET filter

    describe('POST pet data', () => {

        it('should create a new pet', (done) => {
            chai.request(server)
                .post('/pets/')
                .type('json')
                .send(petData)
                .end((err, result) => {
                    assert(result.status === 201);
                    if(err) { console.error(`POST create -> ${err}`)}
                    Pet.findById(result.body.id, (err, pet) => {
                        if(err) { console.error(`POST create pet -> ${err}`)}
                        assert(pet.name === petData.name);
                        assert((owner._id).equals(pet.owner._id));
                        assert((vet._id).equals(pet.visits[0].vet._id));
                        done();
                    })
                })
        });

        it('should fail if fields are missing', (done) => {
            delete petData['name'];
            chai.request(server)
                .post('/pets/')
                .type('json')
                .send(petData)
                .end((err, result) => {
                    assert(result.status === 404);
                    if(err) { console.error(`POST create -> ${err}`)}
                    done();
                })
        })

        it('should fail to create if a field is invalid', (done) => {
            petData.name = null;
            chai.request(server)
                .post('/pets/')
                .type('json')
                .send(petData)
                .end((err, result) => {
                    assert(result.body.error.name.includes('ValidationError'));
                    assert(result.status === 404);
                    if(err) { console.error(`POST create pet error: ${err}`)}
                    done();
                })
        })
    }) // describe POST

    describe('PUT pet data', () => {
        beforeEach(() => {
        })

        afterEach(() => {
        })

        it('should update a pet field', (done) => {
            let newPetData = {
                pet_type: 'lizard',
                name: 'benny'
            };   
            chai.request(server)
                .put('/pets/' + pet._id)
                .type('json')
                .send(newPetData)
                .end((err, res) => {
                    if (err) { console.error(`PUT pet ${err}`)}
                    assert(res.status === 201);
                    assert((pet._id).equals(res.body.data._id))
                    assert(res.body.data.pet_type === newPetData.pet_type)
                    assert(res.body.data.name === newPetData.name)
                    done();
                })
        })

        //{ $pull: { visits: { $elemMatch: { _id : visitId } } } }, 
        //{ $push: { visits: visit }}, 

        it('should add a visit', (done) => {
            let newVisit = {
                visit_date: Date.now(),
                reason: 'Dead',
                vet: vet,
            }
            let update = { $push : { visits: newVisit }};
            chai.request(server)
                .put('/pets/' + pet._id)
                .type('json')
                .send(update)
                .end((err, result) => {
                    if(err) { console.error(`1PUT pet new visit ${err}`) }
                    assert(result.status === 201);
                    assert((pet._id).equals(result.body.data._id));
                    assert(result.body.data.visits.length === pet.visits.length + 1);
                    let addedVisit = result.body.data.visits[1];
                    assert(addedVisit.reason === newVisit.reason);
                    done();
                })
        })

        it.skip('should remove a visit', (done) => {
            let visitId = pet.visits[0]._id;
            let update = { $pull: { visits: { $elemMatch : { _id : visitId }}}};
            chai.request(server)
                .put('/pets/' + pet._id)
                .type('json')
                .send(update)
                .end((err, result) => {
                    if (err) { console.error(`PUT new vist in pet: ${err}`)}
                    assert(result.status === 201);
                    assert((pet._id).equals(result.body.data._id));
                    assert(result.body.data.visits.length === 0);
                    done();
                })

        })
    }) // describe PUT

    describe('DELETE pet data', () => {
        beforeEach(() => {
        })

        afterEach(() => {
        })

        it('should remove a pet by id', (done) => {
            let petId = pet._id;
            chai.request(server)
                .delete('/pets/' + petId)
                .end((err, response) => {
                    if (err) { console.error(`DELETE pet: ${err}`)}
                    assert(response.status === 201);
                    let responseMsg = JSON.stringify(response.body.msg);
                    assert(responseMsg.includes('Sucessfully removed pet id'));
                    assert(responseMsg.includes(petId));
                    done();
                });
        })
    }) // describe DELETE

})
