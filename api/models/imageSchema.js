const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: String,
    image: {
        data: Buffer, // actual binary image data
        contentType: String, // e.g., 'image/jpeg', 'image/png'
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("image", imageSchema);