const config = require('../config/environment/config');
const Owner = require('../models/owners');
const Pet = require('../models/pets');
const Vet = require('../models/vets');
const faker = require('faker');

module.exports = function() {
    if (!config.seedDB) {
        console.log("Seeding is not permited");
        return;
    }

    Vet.deleteMany({})
        .then(() => {
            console.log('Removed all vets');
        })
        .catch((err) => {
            console.log(`REMOVING vets - ${err}`);
        });
    let vetIds = [];

    for(let i = 0; i < 50; i++) {
        const vet = new Vet({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            office_hours: '8:00 AM - 5:00 PM',
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(),
            telephone: faker.phone.phoneNumber
        });
        vet.save()
            .then(() => {
            })
            .catch((err) => {
                console.error(`SEEDING vet - ${err}`);
            });  
        vetIds.push(vet._id);    
    }

    Owner.deleteMany()
        .then(() => {
            console.log('Removed all owners');
        })
        .catch((err) => {
            console.log(`REMOVING owners  - ${err}`);
        });

    Pet.deleteMany({}).then(() => {
        console.log('Removed all pets');
    }).catch((err) => {
        console.log(`Problem removing all pets ${err}`);
    });

    for(let i = 0; i < 100; i++) {
        const owner = new Owner({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            telephone: faker.phone.phoneNumber,
            pets: []
        });
        let petCount = 2;
        for(let j = 0; j < petCount; j++) {
            const pet = new Pet({
                name: 'fido one visit',
                owner: owner,
                pet_type: 'dog',
                visits: [
                    {
                        reason: faker.lorem.sentence(),
                        vet: vetIds[0]
                    }
                ]
            });
            owner.pets.push(pet);
            pet.save()
                .then()
                .catch((err) => console.error(`Pet create err ${err}`))
        }
        owner.save()
            .then(() => {
                //console.log(`Adding owner ${i} -> ${owner.first_name} ${owner.last_name}`) 
            })
            .catch((err) => comsole.error(`Owner create - ${err}`))
    }  
}
