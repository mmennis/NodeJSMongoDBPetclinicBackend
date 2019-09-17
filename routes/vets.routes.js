const express = require('express');
const router = express.Router();

const Vet = require('../models/vets');

router.get('/', function(req, res) {
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
            res.status(404).json({ error: `Problem getting vet by id ${err}`});
            return;
        }
        res.status(200).json({ data: vet });
    })
});

router.post('/', function(req, res) {
    let vetData = req.body;
    let vet = new Vet(vetData);
    vet.save()
        .then(() => {
            res.status(201).json({ msg: 'Vet creation successful', id: vet._id});
            return;
        })
        .catch((err) => { 
            let msg = `Problem creating a new vet - ${err}`;
            res.status(404).json({ error: msg });
        })
})

router.put('/:id', function(req, res) {
    let vetData = req.body;
    let vetId = req.params.id;    
    Vet.findByIdAndUpdate(vetId, 
        vetData, 
        { new: true, runValidators: true }, 
        (err, result) => {
            if(err) {
                let msg =  `Problem updating Vet: ${err}`;
                res.status(404).json({ error: msg });
                return;
            }
            res.status(201).json({ 
                msg: 'Update successful',
                data: result
            })
    })
    
})

module.exports = router;