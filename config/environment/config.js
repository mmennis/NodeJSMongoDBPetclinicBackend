const path = require('path');
const _ = require('lodash');
const local = require('../local.env');

if (!process.env.NODE_ENV) {
    console.error(`Environment not set.  Please set to 'dev' or 'test'`);
    requiredProcessEnv(NODE_ENV);
    process.exit(1);
}

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw Error(`Process env ${name} must be set`);
    }
    return process.env[name];
}

// This is the base config required for all applications
let config = {
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname + '../../'),
    port: process.env.PORT || 4100,
    ip: process.env.IP || '0.0.0.0',
    seedDB: false,
    mongo: {
        options: {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            connectTimeoutMS: 2000,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    }
}

// Merge flattened configs
// _ is lodash lib for merging maps.
module.exports = _.merge(
    config,
    require('../local.env'),
    require('./' + process.env.NODE_ENV + '.js') || {}
);