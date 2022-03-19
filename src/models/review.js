const mongoose = require('mongoose')
const validator = require('validator')


const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        validate(value) {
            if (value > 5) {
                throw new Error('Rating must be less than 5.0')
            }
        }
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review