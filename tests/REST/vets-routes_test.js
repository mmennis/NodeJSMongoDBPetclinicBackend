const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const faker = require('faker');
const should = chai.should();
chai.use(chaiHttp);

const Vet = require('../../models/vets');


describe('Vets REST api routes', () => {

    let vet;
    let vetData;
    beforeEach((done) => {
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
        vet.save()
            .then(() => done())
            .catch((err) => console.error(err));
    })

    afterEach((done) => {
        Vet.deleteMany({}, (err) => {
            if (err) { console.error(`AFTER EACH delete ${err}`) }
            done();
        })
    })

    describe('GET vet data', () => {

        it('should GET all', (done) => {
            chai.request(server)
                .get('/vets/')
                .end((err, result) => {
                    assert(result.status === 200);
                    assert(result.body.data.length > 0);
                    assert(JSON.stringify(result.body.data[0]._id) === JSON.stringify(vet._id));
                    done();
                });
        });

        it('should GET by id', (done) => {
            chai.request(server)
                .get('/vets/' + vet._id)
                .end((err, result) => {
                    assert(result.status === 200);
                    assert(JSON.stringify(result.body.data._id) === JSON.stringify(vet._id));
                    done();
                });
        });

        it('return a 404 when no id match', (done) => {
            chai.request(server)
                .get('/vets/123456')
                .end((err, result) => {
                    assert(result.status === 404);
                    done();
                })
        })
    });

    describe('POST vet data', () => {

        beforeEach(() => {})

        it('should create a new vet', (done) => {
            chai.request(server)
                .post('/vets/')
                .type('form')
                .send(vetData)
                .end((err, result) => {
                    if (err) { console.error(`POST create -> ${err}`) }
                    assert(result.status === 201);
                    Vet.findById(result.body.id, (err, vet) => {
                        assert(vet.last_name === vetData.last_name);
                        assert(vet.telephone === vetData.telephone);
                        done();
                    })
                })
        })

        it('should fail to create if a required field is missing', (done) => {
            delete vetData['state']
            chai.request(server)
                .post('/vets/')
                .type('form')
                .send(vetData)
                .end((err, result) => {
                    if (err) { console.error(`POST create -> ${err}`) }
                    assert(result.status === 404);
                    done();
                })
        })
    })

    describe('PUT vet data', () => {
        beforeEach(() => {

        })

        afterEach(() => {

        })

        it('should update a single field correctly', (done) => {
            let newVetData = {
                last_name: faker.name.lastName(),
                first_name: faker.name.firstName(),
                specialty: 'BOUNCING!!!',
            }
            chai.request(server)
                .put('/vets/' + vet._id)
                .type('json')
                .send(newVetData)
                .end((err, res) => {
                    if (err) { console.log(`PUT problem ${err}`) }
                    assert(res.status === 201);
                    assert((vet._id).equals(res.body.data._id))
                    assert(newVetData.last_name === res.body.data.last_name);
                    assert(newVetData.specialty === res.body.data.specialty);
                    done();
                })
        })

        it('should fail to update if update is invalid', (done) => {
            let newVetData = {
                last_name: faker.name.lastName(),
                first_name: faker.name.firstName(),
                specialty: null
            }
            chai.request(server)
                .put('/vets/' + vet._id)
                .type('json')
                .send(newVetData)
                .end((err, res) => {
                    if (err) { console.log(`PUT problem ${err}`) }
                    assert(res.status === 404);
                    assert(res.body.error.includes('ValidationError'));
                    done();
                })
        })

    })

    describe('DELETE vet data', () => {
        it('should remove a vet by id', (done) => {
            chai.request(server)
                .delete('/vets/' + vet._id)
                .end((err, response) => {
                    if (err) { console.error(`DELETE rest failed ${err}`) }
                    assert(response.status === 201);
                    let responseMsg = JSON.stringify(response.body.msg);
                    assert(responseMsg.includes('Sucessfully removed vet id'));
                    assert(responseMsg.includes(vet._id));
                    done();
                })
        });

        it('should fail to delete if id is invalid', (done) => {
            chai.request(server)
                .delete('/vets/' + 1234567)
                .end((err, response) => {
                    if (err) { console.error(`DELETE rest failed ${err}`) }
                    assert(response.status === 404);
                    let responseMsg = JSON.stringify(response.body.error);
                    assert(responseMsg.includes('Cannot delete'));
                    assert(responseMsg.includes('1234567'));
                    assert(responseMsg.includes('CastError'));
                    done();
                })
        })
    });
});