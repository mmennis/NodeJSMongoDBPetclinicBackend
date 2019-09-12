const express = require('express');
const router = express.Router();

// Routes preceeded by '/verify'

router.get('/', function(req, res) {
    console.log("Called to verify route");
    res.send("Petclinic GET verification test");
});

router.get('/test', function(req, res) {
    console.log('Received a request for verify test endpoint');
    res.status(200).json({ message: 'This is jus a test' });
});

module.exports = router;