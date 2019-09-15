const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Pet = require('./pets');

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
    state: {
        type: String,
        required: true,
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

OwnerSchema.pre('deleteMany', { query: true, document: true }, function(next) {
    Pet.deleteMany({ owner: this._id}, next);
})

OwnerSchema.pre('deleteOne', { query: true, document: true }, function(next) {
    Pet.deleteMany({ owner: this._id}, next);
})

OwnerSchema.index({ last_name: 1, type: -1 });
OwnerSchema.index({ state: 1, type: -1 });

module.exports = mongoose.model('Owner', OwnerSchema);