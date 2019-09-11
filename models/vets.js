const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VetSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
        index: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Vet', VetSchema);