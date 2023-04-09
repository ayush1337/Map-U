const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            min: 3,
            max: 60,
        },
        desc: {
            type: String,
            required: true,
            min: 3,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        long: {
            type: Number,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
        image: String,
        likes: [
            {
                type: mongoose.ObjectId,
                ref: 'User',
                require: false,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Pin', PinSchema);
