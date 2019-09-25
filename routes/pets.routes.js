const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MongoQS = require('mongo-querystring'); 
const qs = new MongoQS();

const Pet = require('../models/pets');

/**
 * @swagger
 * 
 * /pets:
 *   get:
 *     tags:
 *       - pets
 *     description: Returns filtered list of pets per url paramerets
 *     responses:
 *       200:
 *         description: List of matching pets
 *       404:
 *         description: A problem was found with retrieval
 */
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

/**
 * @swagger
 * 
 * /pets/{id}:
 *   get:
 *     tags:
 *       - pets
 *     description: Returns pet by id specified
 *     parameters:
 *       - name:id
 *         description:unique id for pet
 *         type:string
 *     responses:
 *       200:
 *         description: Matching pet
 *       404:
 *         description: A problem was found with retrieval
 */
router.get('/:id', function(req, res) {
    Pet.findById(req.params.id, (err, pet) => {
        if(err) { 
            res.status(404).json({ error: `Problem get pet by id: ${err}`});
            return;
        }
        res.status(200).json({ data: pet });
    })
});

/**
 * @swagger
 * 
 * /pets:
 *   post:
 *     tags:
 *       - pets
 *     description: Create a new pet
 *     responses:
 *       201:
 *         description: new pet id
 *       404:
 *         description: A problem was found with creation
 */
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

/**
 * @swagger
 * 
 * /pets/{id}:
 *   put:
 *     tags:
 *       - pets
 *     description: Update a pet
 *     responses:
 *       201:
 *         description: new pet id
 *       404:
 *         description: A problem was found with update
 */
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

/**
 * @swagger
 * 
 * /pets/{id}:
 *   delete:
 *     tags:
 *       - pets
 *     description: Delete a pet by id
 *     responses:
 *       201:
 *         description: success message
 *       404:
 *         description: A problem was found with deletion
 */
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