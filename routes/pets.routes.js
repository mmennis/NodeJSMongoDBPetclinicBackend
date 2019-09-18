const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pet = require('../models/pets');

router.get('/', function(req, res) {
    Pet.find({}, (err, pets) => {
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
    //console.log(`RECEIVED ${JSON.stringify(petData)}`)
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

module.exports = router;