const express = require('express');
const router = express.Router();

const verifyRoutes = require('./routes/verify');

module.exports = function(app) {
    app.use('/verify', verifyRoutes);
}