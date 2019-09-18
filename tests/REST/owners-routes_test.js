const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const should = chai.should();
chai.use(chaiHttp);
const faker = require('faker');

const Owner = require('../../models/owners');
const Pet = require('../../models/pets');

describe('Owners REST api routes', () => {

    let owner;
    let ownerData;
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
        owner.save()
            .then(() => done())
            .catch((err) => console.error(`BEFORE each - ${err}`));
    })

    afterEach((done) => {
        Owner.deleteMany({}, (err) => {
            if (err) { console.error(`AFTER each delete ${err}`) }
        })
        Pet.deleteMany({}, (err) => {
            if (err) { console.error(`AFTER each pet delete ${err}`) }
            done();
        })
    })

    describe('GET owner data', () => {

        it('should GET all', (done) => {
            chai.request(server)
                .get('/owners/')
                .end((err, result) => {
                    assert(result.status === 200);
                    assert(result.body.data.length > 0);
                    assert((owner._id).equals(result.body.data[0]._id))
                    done();
                });
        })

        it('return a 404 when no id match', (done) => {
            chai.request(server)
                .get('/owners/123456')
                .end((err, result) => {
                    assert(result.status === 404);
                    done();
                })
        })

        it('should return a 200 when id is matched', (done) => {
            chai.request(server)
                .get('/owners/' + owner._id)
                .end((err, result) => {
                    assert(result.status === 200);
                    assert(JSON.stringify(result.body.data._id) === JSON.stringify(owner._id));
                    done();
                })
        })
    })

    describe('POST owner data', () => {
        beforeEach(() => {})

        it('should create a new owner with no pets', (done) => {
            chai.request(server)
                .post('/owners/')
                .type('form')
                .send(ownerData)
                .end((err, result) => {
                    if (err) { console.error(`POST create -> ${err}`) }
                    assert(result.status === 201);
                    Owner.findById(result.body.id, (err, owner) => {
                        assert(owner.last_name === ownerData.last_name)
                        assert(owner.telephone === ownerData.telephone)
                        done();
                    })
                })
        });

        it('should fail to create if a required field is missing', (done) => {
            delete ownerData['telephone']
            chai.request(server)
                .post('/owners/')
                .type('form')
                .send(ownerData)
                .end((err, result) => {
                    if (err) { console.error(`POST create -> ${err}`) }
                    assert(result.status === 404);
                    done();
                })
        })
    });

    describe('PUT owner updates', () => {
        beforeEach(() => {})

        afterEach(() => {})

        it('should change fields in the owner', (done) => {
            let update = {
                last_name: 'Murphy',
                city: 'Wexford'
            }
            chai.request(server)
                .put('/owners/' + owner._id)
                .type('json')
                .send(update)
                .end((err, result) => {
                    assert(result.status === 201);
                    assert(result.body.data.lastName === update.lastName);
                    assert((owner._id).equals(result.body.data._id));
                    done();
                })
        });

        it('should add a pet', (done) => {
            var petData = {
                name: 'tiddles',
                owner: owner,
                pet_type: 'cat',
                visits: []
            };
            var pet = new Pet(petData);
            pet.save().then().catch((err) => {})
            console.log('Original Owner: ' + owner)
            let update = { $push: { pets: pet } };

            chai.request(server)
                .put('/owners/' + owner._id)
                .type('json')
                .send(update)
                .end((err, result) => {
                    if (err) { console.error(`PUT new pet owner: ${err}`) }
                    assert(result.status === 201);
                    assert((owner._id).equals(result.body.data._id));
                    assert((pet._id).equals(result.body.data.pets[0]));
                    done();
                });
        })
    });

    describe('DELETE owner data', () => {
        it('should delte an owner by id', (done) => {
            let ownerId = owner._id;
            chai.request(server)
                .delete('/owners/' + ownerId)
                .end((err, response) => {
                    if (err) { console.error(`DELETE owner ${err}`) }
                    assert(response.status === 201);
                    let responseMsg = JSON.stringify(response.body.msg);
                    assert(responseMsg.includes('Successful delete'))
                    assert(responseMsg.includes(owner._id));
                    done();
                })
        });

        it('should fail if id is not correct', (done) => {
            chai.request(server)
                .delete('/owners/' + 1234567)
                .end((err, response) => {
                    if (err) { console.error(`DELETE owner ${err}`) }
                    assert(response.status === 404);
                    let responseMsg = JSON.stringify(response.body.error);
                    assert(responseMsg.includes('Problem deleting'));
                    assert(responseMsg.includes('1234567'));
                    assert(responseMsg.includes('CastError'));
                    done();
                })
        });
    })
})