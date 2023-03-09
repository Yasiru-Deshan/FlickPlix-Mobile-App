const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
  },
  password: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  address: {
    type: String,
  },
  age: {
    type: Number,
  },
  mobile: {
    type: String,
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  favorites: [
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
      day: {
        type: Number,
      },
    },
  ],
  playLists: [
    {
      playListId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayList",
      },
      name: {
        type: String,
        max: 10,
      },
      desc: {
        type: String,
        max: 500,
      },
      // movies: [
      //   {
      //     movieId: {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "Movie",
      //     },
      //     title: {
      //       type: String,
      //     },
      //     img: {
      //       type: String,
      //     },
      //     year: {
      //       type: String,
      //     },
      //     genre: {
      //       type: String,
      //     },
      //   },
      // ],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
