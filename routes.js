const express = require('express');
const router = express.Router();

const verifyRoutes = require('./routes/verify.routes');
const ownersRoutes = require('./routes/owners.routes');
const vetsRoutes = require('./routes/vets.routes');
const petsRoutes = require('./routes/pets.routes');

module.exports = function(app) {
    app.use('/verify', verifyRoutes);
    app.use('/owners', ownersRoutes);
    app.use('/vets', vetsRoutes);
    app.use('/pets', petsRoutes);
}