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
    age: {
        type: Number,
        default: 1,
        required: true,
        min: 0,
        max: 20
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
PetSchema.index({ "visits.vet": 1, type: -1 })

module.exports = mongoose.model('Pet', PetSchema);