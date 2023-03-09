const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  comment: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
