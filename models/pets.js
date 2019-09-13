const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        ref: 'Owner',
        type: mongoose.Schema.Types.ObjectId,
    },
    pet_type: {
        type: String,
        required: true
    },
    visits: [
        {
            visit_date: {
                type: Date,
                default: Date.now,
            },
            reason: {
                type: String,
                required: true,
            },
            vet: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vet'
            }
        }
    ]
}, {
    toJSON: {
        virtuals: true,
        getters: true,
        setters: true,
    },
    timestamps: true
});

PetSchema.index({ owner: 1, name: 1, type: -1 });

module.exports = mongoose.model('Pet', PetSchema);