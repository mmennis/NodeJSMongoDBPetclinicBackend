let local = require('../local.env');

module.exports = {
    DEBUG: '*',
    port: 4100,
    ip: '0.0.0.0',
    seedDB: true,
    seedConstants: {
        petCount: 4,
        ownerCount: 250,
        vetCount: 60,
        visitCount: 20
    },
    webApp: {
        url: 'http://localhost:80'
    },
    db: {
        URI: 'mongodb://example:example@database-test:27017/petclinic_dev?authMechanism=SCRAM-SHA-1&authSource=admin',
    },
    mongoose: {
        debug: false
    },
};