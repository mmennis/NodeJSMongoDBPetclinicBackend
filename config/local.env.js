module.exports = {
    secrets: {
        session: 'petclinic-app',
        expiresIn: 2629746000
    },
    db: {
        URI: 'mongodb://example:example@database:27017/petclinic?authMechanism=SCRAM-SHA-1&authSource=admin',
    }
}