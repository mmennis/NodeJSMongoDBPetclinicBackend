const express = require('express');
const router = express.Router();

const Pet = require('../models/pets');

router.get('/', function(req, res) {
    Pet.find({}, (err, pets) => {
        if(err) {
            res.status(404).json({ error: `Find all pets ${err}`})
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

module.exports = router;