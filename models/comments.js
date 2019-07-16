const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    rating: Number,
    created: {type: Date, default: Date.now}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;