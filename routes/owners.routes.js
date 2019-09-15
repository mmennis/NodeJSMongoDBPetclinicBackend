const express = require('express');
const router = express.Router();

const Owner = require('../models/owners');

router.get('/', function(req, res) {
    Owner.find({}, function(err, owners) {
        if (err) {
            res.status(500).json({ error: `Problem with owners data ${err}` })
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

module.exports = router;