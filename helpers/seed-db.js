const config = require('../config/environment/config');
const Owner = require('../models/owners');
const Pet = require('../models/pets');
const Vet = require('../models/vets');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

var contents = fs.readFileSync(__dirname +'/samples/pet_names.txt', 'UTF-8');
const petNames = contents.trim().split(',');

contents = fs.readFileSync(__dirname + '/samples/pet_types.txt', 'UTF-8');
const petTypes = contents.trim().split(',');

contents = fs.readFileSync(__dirname + '/samples/vet_specialties.txt', 'UTF-8');
const vetSpecialties = contents.trim().split(',');

module.exports = function() {

    console.log('------------------------------------------------');
    console.log(config);
    console.log('------------------------------------------------');

    if (!config.seedDB) {
        console.log("Seeding is not permited");
        return;
    } else {
        console.log('Dropping collections before re-seeding');
        Vet.collection.drop();
        Owner.collection.drop();
        Pet.collection.drop();
    }

    let vetIds = [];
    for(let i = 0; i < config.seedConstants.vetCount; i++) {
        const vet = new Vet({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            office_hours: '8:00 AM - 5:00 PM',
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber,
            specialty: vetSpecialties[Math.floor((Math.random() * vetSpecialties.length))]
        });
        vet.save()
            .then(() => {
                vetIds.push(vet._id); 
            })
            .catch((err) => {
                console.error(`SEEDING vet - ${err}`);
            });
    }

    for(let i = 0; i < config.seedConstants.ownerCount; i++) {
        const owner = new Owner({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            telephone: faker.phone.phoneNumber(),
            pets: []
        });
        let petCount = Math.floor(Math.random() * config.seedConstants.petCount) + 1;
        
        for(let j = 0; j < petCount; j++) {
            const pet = new Pet({
                name: petNames[Math.floor((Math.random() * petNames.length))],
                owner: owner,
                pet_type: petTypes[Math.floor((Math.random() * petTypes.length))],
                visits: []
            });
            let visitCount = Math.floor(Math.random() * config.seedConstants.visitCount);
            for(k = 0; k < visitCount; k++) {
                vetId = vetIds[Math.floor((Math.random() * vetIds.length))]
                pet.visits.push({
                    reason: faker.lorem.sentence(),
                    vet: vetId
                })
            }
            
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
