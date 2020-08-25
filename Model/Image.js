const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    keywords: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Image', imageSchema);