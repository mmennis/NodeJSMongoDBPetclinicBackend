const mongoose = require('mongoose');
// This might be a little dangerous.  
// But turns off warning about emitters and potential memory leaks.
require('events').EventEmitter.defaultMaxListeners = 0;
const config = require('../config/environment/config');

module.exports = function(){
// Use e26 style Promises
mongoose.Promise = global.Promise;

console.log(config);
console.log(config.db.URI);

mongoose.connect('mongodb://localhost:27017/petclinic_test', 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        connectTimeoutMS: 2000,
        useCreateIndex: true,
        useFindAndModify: false,
    });

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



