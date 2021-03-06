const swaggerJSDOC = require('swagger-jsdoc');

const { description, version } = require('../package.json');  

const config = require('./environment/config');

const options = {
    definition: {
        components: {},
        info: {
            description,
            version,
            title: 'PetClinic API service'
        },
        host: `${config.ip}:${config.port}`,
        basePath: '/',
        produces: ['application/json'],
        schemes: [
            'http'
        ],
    },
    apis: ['./routes/**/*.js', './models/components.js'],
};

module.exports = {
    spec() {
        return swaggerJSDOC(options);
    }
}