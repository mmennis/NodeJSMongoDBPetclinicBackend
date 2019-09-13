const mongoose = require('mongoose');

module.exports = function(){
// Use e26 style Promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/petclinic_test', 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        connectTimeoutMS: 2000,
        useCreateIndex: true
    });

mongoose.connection
    .once('open', () => {
        //console.debug('MongoDB connection established')
    })
    .on('error', (error) => {
        console.warn(`Failed to establish MongoDB connection`);
    });
}



