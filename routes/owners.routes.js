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
        if(err) {
            res.status(404).json({ error: `Problem getting owner by if ${err}`});
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
            if (err) { console.error(msg)}
            res.status(404).json({ error: msg });
        })
});
module.exports = router;