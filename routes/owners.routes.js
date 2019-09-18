const express = require('express');
const router = express.Router();

const Owner = require('../models/owners');

router.get('/', function(req, res) {
    Owner.find({}, function(err, owners) {
        if (err) {
            res.status(500).json({ error: `Problem with owners data ${err}` })
            return;
        }
        res.status(200).json({ data: owners });
    });
});

router.get('/:id', function(req, res) {
    Owner.findById(req.params.id, function(err, owner) {
        if (err) {
            res.status(404).json({ error: `Problem getting owner by if ${err}` });
            return;
        }
        res.status(200).json({ data: owner });
    });
});

router.post('/', function(req, res) {
    let ownerData = req.body;
    let owner = new Owner(ownerData);
    owner.save()
        .then(() => {
            res.status(201).json({ msg: 'Owner creation successful', id: owner._id })
        })
        .catch((err) => {
            let msg = `Problem creating new owner: ${err}`;
            if (err) { console.error(msg) }
            res.status(404).json({ error: msg });
        })
});

router.put('/:id', function(req, res, next) {
    let ownerId = req.params.id;
    let ownerUpdate = req.body;
    Owner.findByIdAndUpdate(ownerId,
        ownerUpdate, { new: true, runValidators: true },
        (err, result) => {
            if (err) {
                let message = `Problem updating the owner ${ownerId}: ${err}`;
                console.error(message);
                res.status(404).json({ error: message });
                return;
            }
            res.status(201).json({
                msg: 'Update successful',
                data: result,
            });
        });
});

router.delete('/:id', function(req, res, next) {
    let ownerId = req.params.id;
    Owner.deleteOne({ '_id': ownerId }, (err) => {
        if (err) {
            let message = `Problem deleting ${ownerId}: ${err}`;
            console.error(message);
            res.status(404).json({ error: message });
            return;
        }
        res.status(201).json({ msg: `Successful delete ${ownerId}` });
    });
})

module.exports = router;