const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    console.log("Called to verify route");
    res.send("Petclinic GET verification test");
});

module.exports = router;