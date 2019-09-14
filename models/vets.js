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
    },
    office_hours: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

VetSchema.index({ last_name: 1, type: -1 });
VetSchema.index({ state: 1, type: -1 });

module.exports = mongoose.model('Vet', VetSchema);