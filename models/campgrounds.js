const mongoose = require('mongoose');

const campsSchema = new mongoose.Schema ({
    name: String,
    img: String,
    desc: String
});
const Campground = mongoose.model("Campground", campsSchema);

module.exports = Campground;