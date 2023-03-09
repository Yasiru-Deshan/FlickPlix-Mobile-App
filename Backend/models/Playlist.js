const mongoose = require("mongoose");

const playListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: {
    type: String,
    max: 10,
    required: true,
  },

  desc: {
    type: String,
    max: 500,
  },
  movies: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
      // title: {
      //   type: String,
      // },
      // img: {
      //   type: String,
      // },
      // year: {
      //   type: String,
      // },
      // genre: {
      //   type: String,
      // },
    },
  ],
});

module.exports = mongoose.model("PlayList", playListSchema);