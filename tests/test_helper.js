const mongoose = require('mongoose');

// Use e26 style Promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/petclinic_test', 
    { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 2000});

mongoose.connection
    .once('open', () => console.log('MongoDB connection established'))
    .on('error', (error) => {
        console.warn(`Failed to establish MongoDB connection`);
    });

