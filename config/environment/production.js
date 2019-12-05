let local = require('../local.env');

module.exports = {
    DEBUG: '',
    port: 4100,
    ip: '0.0.0.0',
    seedDB: true,
    webApp: {
        url: 'http://localhost:80'
    },
    db: {
        URI: 'mongodb://database:27017/petclinic',
    }
};