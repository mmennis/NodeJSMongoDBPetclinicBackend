const express = require('express');
const router = express.Router();
const MongoQS = require('mongo-querystring'); 
const qs = new MongoQS();

const Owner = require('../models/owners');

/**
 * @swagger
 * 
 * /owners:
 *   get:
 *     tags:
 *       - owners
 *     description: Retrieve list of owners filtered
 *     responses:
 *       200:
 *         description: list of owners
 *       404:
 *         description: A problem was found with retrieval
 */
router.get('/', function(req, res) {
    let queryString = qs.parse(req.query); // convert url parameters to mongo filter (>, <, etc.)
    Owner.find(queryString, function(err, owners) {
        if (err) {
            res.status(500).json({ error: `Problem with owners data ${err}` })
            return;
        }
        res.status(200).json({ data: owners });
    });
});

/**
 * @swagger
 * 
 * /owners/{id}:
 *   get:
 *     tags:
 *       - owners
 *     description: Retrieve list of owners filtered
 *     responses:
 *       200:
 *         description: list of owners
 *       404:
 *         description: A problem was found with retrieval
 */
router.get('/:id', function(req, res) {
    Owner.findById(req.params.id, function(err, owner) {
        if (err) {
            res.status(404).json({ error: `Problem getting owner by if ${err}` });
            return;
        }
        res.status(200).json({ data: owner });
    });
});

/**
 * @swagger
 * 
 * /owners:
 *   post:
 *     tags:
 *       - owners
 *     description: Create a new owner
 *     responses:
 *       201:
 *         description: new owner id
 *       404:
 *         description: A problem was found with creation
 */
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

/**
 * @swagger
 * 
 * /owners/{id}:
 *   put:
 *     tags:
 *       - owners
 *     description: Update owner by id
 *     responses:
 *       201:
 *         description: new updated owner
 *       404:
 *         description: A problem was found with update
 */
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

/**
 * @swagger
 * 
 * /owners/{id}:
 *   delete:
 *     tags:
 *       - owners
 *     description: Delete an owner by id
 *     responses:
 *       201:
 *         description: success message
 *       404:
 *         description: A problem was found with update
 */
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