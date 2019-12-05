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
        URI: 'mongodb://example:example@database-test:27017/petclinic_test?authMechanism=SCRAM-SHA-1&authSource=admin',
    },
    mongoose: {
        debug: false
    },
};