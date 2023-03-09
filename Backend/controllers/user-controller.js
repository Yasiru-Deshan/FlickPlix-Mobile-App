const User = require("../models/User");
const Movie = require("../models/Movie");
const PlayList = require("../models/Playlist");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Comment = require("../models/Comment");
const Playlist = require("../models/Playlist");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .populate("package");

    if (!users) {
      ("no user");
      return res.status(404).json({
        msg: "No users yet",
      });
    }
    return res.status(200).json({ msg: "users found", users });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

const login = async (req, res, next) => {
  ("login");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No user found for this email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Email and password does not match",
      });
    }
    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    user.password = undefined;
    jwt.sign(data, "flickplix", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        role: user.role,
        user: user,
      });
    });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const addUser = async (req, res, next) => {
  const {
    email,
    image,
    password,
    firstName,
    lastName,
    address,
    gender,
    age,
    mobile,
    packageId,
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      ("user found");
      return res.status(400).json({
        msg: "This email is being used. please use a different email",
      });
    } else {
      user = new User({
        email,
        image: image
          ? image
          : "https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg",
        password,
        firstName,
        lastName,
        age: parseInt(age),
        address,
        mobile,
        gender,
        role: "user",
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const data = {
        user: {
          firstName: firstName,
          id: user.id,
          role: "user",
        },
      };
      return res.status(200).json({
        msg: `${firstName} created as a customer`,
        data,
      });
    }
  } catch (err) {
    err;
    return res.status(500).json({
      msg: err,
    });
  }
};

const updateUser = async (req, res, next) => {
  const {
    userId,
    email,
    image,
    firstName,
    lastName,
    address,
    age,
    mobile,
    packageId,
  } = req.body;
  try {
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        msg: "Can't find a user for this id",
      });
    }

    if (user.email != email) user.email = email;
    if (user.image != image) user.image = image;
    if (user.firstName != firstName) user.firstName = firstName;
    if (user.lastName != lastName) user.lastName = lastName;
    if (user.address != address) user.address = address;
    if (user.age != age) user.age = age;
    if (user.mobile != mobile) user.mobile = mobile;
    if (packageId) user.package = packageId;

    await user.save();

    return res.status(200).json({ msg: "User updated", user });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};
const signUp = async (req, res, next) => {
  const { email, password, firstName, lastName, address, age, mobile } =
    req.body;

  let user;
  try {
    user = new User({
      email,
      password,
      firstName,
      lastName,
      age,
      address,
      mobile,
      role: "user",
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(data, "alphafitness", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        token,
        name: firstName,
        id: user.id,
        role: user.role,
      });
    });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const validateEmail = (email) => {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(String(email).toLowerCase());
};

const uploadProfilePic = async (req, res, next) => {
  const { image } = req.body;
  "uploading", image;
  const userId = req.user.id;
  try {
    let customer = await User.findById(userId);
    customer.image = image;
    await customer.save();
    return res.status(200).json({ msg: "profile picture updated" });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

const deleteCustomer = async (req, res, next) => {
  const { userId } = req.body;

  let customer;
  try {
    customer = await User.findById(userId);
    if (!customer) {
      return res.status(404).json({
        msg: "No user found, User already deleted or never exited",
      });
    }
    if (customer.role != "user") {
      return res.status(404).json({ msg: "This user is not customer" });
    }

    await Order.deleteMany({ user: userId });
    await Feedback.deleteMany({ user: userId });
    await Advertisment.deleteMany({ user: userId });
    await customer.remove();

    return res.status(200).json({ msg: "Customer removed successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

//add to favorites
const addToFavorites = async (req, res, next) => {
  try {
    let newFav = {
      movieId: req.body.movieId,
      //   title: req.body.title,
      //   img: req.body.img,
      //   year: req.body.year,
      //   genre: req.body.genre,
      //   day: Date.now,
    };

    const user = await User.findById(req.params.id);

    // const savedFav = await user.updateOne({
    //   $push: { favorites: [newFav] },
    // });
    user.favorites.unshift(newFav);
    await user.save();
    res.status(200).json("Movie added to favorites");
  } catch (err) {
    res.status(500).json(err);
  }
};

//add to playlist
const addToPlaylist = async (req, res, next) => {
  try {
    let newItem = {
      movieId: req.body.movieId,
    };

    //const user = await User.findById(req.params.id);
    const playlist = await PlayList.findById(req.params.id);

    // const savedFav = await user.updateOne({
    //   $push: { favorites: [newPlaylist] },
    // });
    playlist.movies.unshift(newItem);
    await playlist.save();
    res.status(200).json("Movie added to favorites");
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFavorites = async (req, res, next) => {
  //const user = await User.findById(req.body.userId);
  try {
    const user = await User.findById(req.params.id).populate(
      "favorites.movieId"
    );
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json(err);
  }
};

//create a playlist
const createPlayList = async (req, res, next) => {
  try {
    const newPlayList = new PlayList({
      user: req.params.id,
      name: req.body.name,
      desc: req.body.desc,
    });

    const user = await User.findById(req.params.id);

    await user.updateOne({
      $push: { playLists: [newPlayList] },
    });
    await newPlayList.save();
    res.status(200).json("PlayList Created");
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all playlists
const getPlayLists = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("playLists");
    res.json(user.playLists);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get a playlist
const getPlayList = async (req, res, next) => {
  try {
    //const user = await User.findById(req.params.id);

    const playlist = await Playlist.findById(req.params.id).populate(
      "movies.movieId"
    );

    if (playlist) {
      res.status(200).json(playlist.movies);
      //console.log(playlist.movies);
    } else {
      res.status(500).json("You can't access this playlist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//update playlist
const updatePlayList = async (req, res, next) => {
  try {
    const playlist = await PlayList.findById(req.params.id);

    await playlist.updateOne({ $set: req.body });
    res.status(200).json("Playlist has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

//CREATE
const addMovie = async (req, res, next) => {
  const {
    mId,
    title,
    desc,
    img,
    trailer,
    video,
    year,
    genre,
    likes,
    comments,
  } = req.body;
  const userId = req.user.id;

  try {
    let movie = new Movie({
      user: userId,
      title,
      desc,
      img,
      trailer,
      video,
      year,
      genre,
      likes,
      comments,
    });

    await movie.save();

    return res.status(200).json({ msg: "Movie created successfully", movie });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

exports.getUsers = getUsers;
exports.login = login;
exports.addUser = addUser;

exports.addToFavorites = addToFavorites;
exports.addToPlaylist = addToPlaylist;
exports.getFavorites = getFavorites;
exports.getPlayLists = getPlayLists;
exports.getPlayList = getPlayList;
exports.createPlayList = createPlayList;
exports.updatePlayList = updatePlayList;
exports.updateUser = updateUser;
exports.deleteCustomer = deleteCustomer;
exports.uploadProfilePic = uploadProfilePic;
exports.signUp = signUp;
exports.addMovie = addMovie;
