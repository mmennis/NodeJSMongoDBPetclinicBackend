const express = require('express');
const router = express.Router();

// Routes preceeded by '/verify'

/**
 * @swagger
 * 
 * /verify:
 *   get:
 *     tags:
 *       - verify
 *     description: Verify that endpoint is working
 *     responses:
 *       201:
 *         description: success message
 *       404:
 *         description: A problem was found with verification
 */
router.get('/', function(req, res) {
    console.log("Called to verify route");
    res.send("Petclinic GET verification test");
});

/**
 * @swagger
 * 
 * /verify/test:
 *   get:
 *     tags:
 *       - verify
 *     description: Verify that endpoint is working
 *     responses:
 *       201:
 *         description: success message
 *       404:
 *         description: A problem was found with verification
 */
router.get('/test', function(req, res) {
    console.log('Received a request for verify test endpoint');
    res.status(200).json({ message: 'This is jus a test' });
});

module.exports = router;