const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MongoQS = require('mongo-querystring'); 
const qs = new MongoQS();

const Pet = require('../models/pets');

router.get('/', function(req, res) {
    // See docs for mongo-querystring https://www.npmjs.com/package/mongo-querystring
    let queryString = qs.parse(req.query); // convert url parameters to mongo filter (>, <, etc.)
    Pet.find(queryString, (err, pets) => {
        if(err) {
            res.status(404).json({ error: `Find all pets ${err}`})
            return;
        }
        res.status(200).json({ data: pets });
    })
});

router.get('/:id', function(req, res) {
    Pet.findById(req.params.id, (err, pet) => {
        if(err) { 
            res.status(404).json({ error: `Problem get pet by id: ${err}`});
            return;
        }
        res.status(200).json({ data: pet });
    })
});

router.post('/', function(req, res) {
    let petData = req.body;
    let pet = new Pet(petData);
    pet.save()
        .then(() => {
            res.status(201).json({ msg: 'Pet create sucessfully', id: pet._id});
            return;
        })
        .catch((err) => {
            if (err) { console.error('POST pet ' + err) }
            res.status(404).json({ error: err })
            return;
        });
});

router.put('/:id', function(req, res) {
    let petId = req.params.id;
    let petData = req.body;
    Pet.findByIdAndUpdate(petId, 
        petData,
        { new: true },
        (err, result) => {
            if (err) {
                let msg = `Problem updating pet ${err}`;
                res.status(404).json({ error: msg })
                return;
            }
            res.status(201).json({
                msg: 'Update successful',
                data: result
            })
        })
});

router.delete('/:id', function(req, res) {
    let petId = req.params.id;
    Pet.deleteOne({ '_id': petId },(err) => {
        if(err) { 
            console.error(`Problem deleting pet ${petId}: ${err}`)
            res.status(404).json({ error: `Cannot delete pet ${petId}: {err}`});
            return;
        }
        res.status(201).json({ msg: `Sucessfully removed pet id ${petId}`});
    })
});
module.exports = router;