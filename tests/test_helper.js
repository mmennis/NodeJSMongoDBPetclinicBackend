const mongoose = require('mongoose');
// This might be a little dangerous.  
// But turns off warning about emitters and potential memory leaks.
require('events').EventEmitter.defaultMaxListeners = 0;
const config = require('../config/environment/config');
mongoose.set('useCreateIndex', true);
mongoose.set('debug', config.mongoose.debug);

module.exports = function(){
    // Use e26 style Promises
    mongoose.Promise = global.Promise;

    mongoose.connect(config.db.URI, config.mongo.options);

    mongoose.connection
        .once('open', () => {
            //console.debug('MongoDB connection established')
        })
        .on('close', () => {
            connection.removeAllListeners();
        })
        .on('error', (error) => {
            console.warn(`Failed to establish MongoDB connection`);
        });
}



