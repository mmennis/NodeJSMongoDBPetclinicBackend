/**
 * Setup express server and associated libraries
 */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const errorHandler = require('errorhandler');
const path = require('path');
const debug = require('debug');

const config = require('./environment/index');

module.exports = function(app) {
    const env = app.get('env');

    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    }));
    app.use(bodyParser.json({
        limit: '50mb',
    }));

    if ('development' === env || 'test' === env) {
        app.use(morgan('dev'));
        app.use(errorHandler());
    }
}