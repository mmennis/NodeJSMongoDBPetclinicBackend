let local = require('../local.env');

module.exports = {
    DEBUG: '',
    port: 4100,
    ip: '0.0.0.0',
    seedDB: false,
    webApp: {
        url: 'http://localhost:80'
    },
    db: {
        URI: 'mongodb://example:example@database:27017/petclinic?authMechanism=SCRAM-SHA-1&authSource=admin',
    }
};