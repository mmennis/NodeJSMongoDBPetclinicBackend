const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const faker = require('faker');
const should = chai.should();
chai.use(chaiHttp);

const Vet = require('../models/vets');


describe('Vets REST api routes', () => {

    let vet;
    beforeEach((done) => {
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
        vet.save()
            .then(() => done())
            .catch((err) => console.error(err));
    })

    afterEach((done) => {
        Vet.findByIdAndDelete(vet._id, (err) => {
            if (err) {
                console.error(`AFTER each - ${err}`);
            }
            done();
        })
    })

    it('should GET all', (done) => {
        chai.request(server)
            .get('/vets/all')
            .end((err, result) => {
                assert(result.status === 200);
                assert(result.body.data.length > 0);
                assert(JSON.stringify(result.body.data[0]._id) === JSON.stringify(vet._id) );
                done();
            });
    });

    it('should GET by id', (done) => {
        chai.request(server)
            .get('/vets/' + vet._id)
            .end((err, result) => {
                assert(result.status === 200);
                assert(JSON.stringify(result.body.data._id) === JSON.stringify(vet._id) );
                done();
            });
    });

    it('return a 500 when no id match', (done) =>{
        chai.request(server)
            .get('/vets/123456')
            .end((err, result) => {
                assert(result.status === 404);
                done();
            })
    })
});