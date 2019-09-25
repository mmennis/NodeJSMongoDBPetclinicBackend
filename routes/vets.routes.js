const express = require('express');
const router = express.Router();
const MongoQS = require('mongo-querystring'); 
const qs = new MongoQS();

const Vet = require('../models/vets');

/**
 * @swagger
 * 
 * /vets:
 *   get:
 *     tags:
 *       - vets
 *     description: Retrieve list of vets filtered
 *     responses:
 *       200:
 *         description: list of vets
 *       404:
 *         description: A problem was found with retrieval
 */
router.get('/', function(req, res) {
    let queryString = qs.parse(req.query); // convert url parameters to mongo filter (>, <, etc.)
    Vet.find(queryString, (err, vets) => {
        if (err) {
            res.status(500).json({ error: `Problem all vets - ${err}` });
            return;
        }
        res.status(200).json({ data: vets });
    });
});

/**
 * @swagger
 * 
 * /vets/{id}:
 *   get:
 *     tags:
 *       - vets
 *     description: Retrieve list of vets filtered
 *     responses:
 *       200:
 *         description: list of vets
 *       404:
 *         description: A problem was found with retrieval
 */
router.get('/:id', function(req, res) {
    let vetId = req.params.id;
    Vet.findById(vetId, (err, vet) => {
        if (err) {
            res.status(404).json({ error: `Problem getting vet by id ${vetId} ${err}` });
            return;
        }
        res.status(200).json({ data: vet });
    })
});

/**
 * @swagger
 * 
 * /vets:
 *   post:
 *     tags:
 *       - vets
 *     description: Create a new vet
 *     responses:
 *       201:
 *         description: new vet id
 *       404:
 *         description: A problem was found with creation
 */
router.post('/', function(req, res) {
    let vetData = req.body;
    let vet = new Vet(vetData);
    vet.save()
        .then(() => {
            res.status(201).json({ msg: 'Vet creation successful', id: vet._id });
            return;
        })
        .catch((err) => {
            let msg = `Problem creating a new vet - ${err}`;
            res.status(404).json({ error: msg });
        })
})

/**
 * @swagger
 * 
 * /vets/{id}:
 *   put:
 *     tags:
 *       - vets
 *     description: Update vet by id
 *     responses:
 *       201:
 *         description: new updated vet
 *       404:
 *         description: A problem was found with update
 */
router.put('/:id', function(req, res) {
    let vetData = req.body;
    let vetId = req.params.id;
    Vet.findByIdAndUpdate(vetId,
        vetData, { new: true, runValidators: true },
        (err, result) => {
            if (err) {
                let msg = `Problem updating Vet ${vetId}: ${err}`;
                res.status(404).json({ error: msg });
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
 * /vets/{id}:
 *   delete:
 *     tags:
 *       - vets
 *     description: Delete a vet by id
 *     responses:
 *       201:
 *         description: success message
 *       404:
 *         description: A problem was found with update
 */
router.delete('/:id', function(req, res, next) {
    let vetId = req.params.id;
    Vet.deleteOne({ '_id': vetId }, (err) => {
        if (err) {
            console.error(`DELETE vet problem ${err}`)
            res.status(404).json({ error: `Cannot delete ${vetId}: ${err}` })
            return;
        }
        res.status(201).json({ msg: `Sucessfully removed vet id ${vetId}` })
    });
});

module.exports = router;