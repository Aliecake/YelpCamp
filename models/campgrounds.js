const mongoose = require('mongoose');

const campsSchema = new mongoose.Schema ({
    name: String,
    img: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});
const Campground = mongoose.model("Campground", campsSchema);

module.exports = Campground;