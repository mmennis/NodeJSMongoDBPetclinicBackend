let local = require('../local.env');

module.exports = {
    DEBUG: '*',
    port: 4100,
    ip: '0.0.0.0',
    seedDB: true,
    seedConstants: {
        petCount: 4,
        ownerCount: 150,
        vetCount: 40,
        visitCount: 10
    },
    webApp: {
        url: 'http://localhost:80'
    },
    db: {
        URI: 'mongodb://localhost:27017/petclinic_dev',
    }
};