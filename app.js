/**
 * Basic server 
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const config = require('./config/environment/config');
const mongoose = require('mongoose');
const allRoutes = require('./routes.js');
const expressConfig = require('./config/express');

const seedDb = require('./helpers/seed-db');

const PORT = 4100;

// Dump configuration for start up check convenience
seedDb();

// Create connection to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect(config.db.URI, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
});
console.log(`Connected to MongoDB ${config.db.URI}`);

const app = express();
expressConfig(app);

// Register all routes from local routes.js file
allRoutes(app);

app.get('/', function(req, res) {
    res.send('Hello World!!');
});

app.listen(PORT, function() {
    console.log(`Server is listening on port ${PORT} in ${app.get('env')} mode`);
});