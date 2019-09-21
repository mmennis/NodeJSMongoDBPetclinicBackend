let local = require('../local.env');

module.exports = {
    DEBUG: '*',
    port: 4101,
    ip: '0.0.0.0',
    seedDB: false,
    webApp: {
        url: 'http://localhost:80'
    },
    db: {
        URI: 'mongodb://localhost:27017/petclinic_test',
    },
    mongoose: {
        debug: false
    },
};