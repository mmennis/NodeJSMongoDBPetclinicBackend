const express = require('express');
const router = express.Router();

const Vet = require('../models/vets');

router.get('/all', function(req, res) {
    Vet.find({}, (err, vets) => {
        if (err) {
            res.status(500).json({ error: `Problem all vets - ${err}`});
        }
        res.status(200).json({ data: vets });
    });
});

router.get('/:id', function(req, res) {
    Vet.findById(req.params.id, (err, vet) => {
        if(err) {
            res.status(500).json({ error: `Problem getting vet by id ${err}`})
        }
        res.status(200).json({ data: vet });
    })
});

module.exports = router;