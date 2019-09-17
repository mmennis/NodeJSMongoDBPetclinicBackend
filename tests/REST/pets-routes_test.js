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
            telephone: faker.phone.phoneNumber,
            specialty: 'surgery'
        };
        vet = new Vet(vetData);
        petData = {
            name: 'fido',
            owner: owner,
            pet_type: 'dog',
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
    });


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
    })

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
    })

})
