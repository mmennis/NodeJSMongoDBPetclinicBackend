/**
 * Basic server 
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const config = require('./config/environment/config');
const mongoose = require('mongoose');

const expressConfig = require('./config/express');

const PORT = 4100;

// Dump configuration for start up check convenience
console.log(config);
const app = express();
expressConfig(app);



app.listen(PORT, function() {
    console.log(`Server is listening on port ${PORT} in ${app.get('env')} mode`);
});