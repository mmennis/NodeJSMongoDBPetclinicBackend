const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server=require("../../app");
const should = chai.should();
chai.use(chaiHttp);
const faker = require('faker');

const Owner = require('../../models/owners');

describe('Owners REST api routes', () => {

    let owner;
    beforeEach((done) => {
        owner = new Owner({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber()
        })
        owner.save()
            .then(() => done())
            .catch((err) => console.error(`BEFORE each - ${err}`));
    })

    afterEach((done) => {
        Owner.findByIdAndRemove(owner._id, (err) => {
            if (err) {
                console.error(`AFTER each - ${err}`);
            }
            done();
        })
    })

    it('should GET all', (done) => {
        chai.request(server)
            .get('/owners/all')
            .end((err, result) => {
                assert(result.status === 200);
                assert(result.body.data.length > 0);
                assert((owner._id).equals(result.body.data[0]._id))
                done();
            });
    })

    it('return a 500 when no id match', (done) =>{
        chai.request(server)
            .get('/owners/123456')
            .end((err, result) => {
                assert(result.status === 404);
                done();
            })
    })
});