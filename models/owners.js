const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OwnerSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    pets: [{
        ref: 'Pet',
        type: mongoose.Schema.Types.ObjectId,
        index: true
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
        setters: true
    }
});

OwnerSchema.index({ last_name: 1, type: -1 });

module.exports = mongoose.model('Owner', OwnerSchema);