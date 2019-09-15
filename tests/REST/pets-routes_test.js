const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const faker = require('faker');
const should = chai.should();
chai.use(chaiHttp);

const Pet = require('../../models/pets');
const Owner = require('../../models/owners');

describe('Pets REST api routes', () => {

    let owner;
    let pet;
    beforeEach((done) => {
        owner = new Owner({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber(),
            pets: []
        })
        pet = new Pet({
            name: 'fido',
            owner: owner,
            pet_type: 'dog',
            visits: [
                {
                    visit_date: Date.now(),
                    reason: 'Sore paw',
                    vet: null,
                }
            ]
        })
        pet.save()
            .then(() => {
                assert(!pet.isNew);
                done()
            })
            .catch((err) => { console.error(`PET save ${err}`)});
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
})
