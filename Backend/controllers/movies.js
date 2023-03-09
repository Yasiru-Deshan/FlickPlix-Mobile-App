const router = require("express").Router();
const Movie = require("../models/Movie");
const Advertisment = require("../models/advertisment-model");

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find()
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });

    
    return res.status(200).json({ msg: "movies found.", movies });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
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

// const getMovieById = async (req, res, next) => {
//   const mId = req.params.id;
//   let movie;
//   try {
//     movie = await Movie.findById(mId)
//       .populate("user")
//       .populate({ path: "comments", populate: { path: "user" } });

//     if (!movie) {
//       return res.status(404).json({ msg: "Cannot find the movie" });
//     }
//     return res.status(200).json({ msg: "Movie found", movie });
//   } catch (err) {
//     return res.status(500).json({
//       msg: err,
//     });
//   }
// };

//UPDATE

const updateMovie = async (req, res, next) => {
  const {
    mId,
    title,
    desc,
    image,
    trailer,
    video,
    year,
    genre,
    likes,
    comments,
  } = req.body;
  const role = req.user.role;
  let movie;

  try {
    movie = await Movie.findById(mId);
    if (!movie) {
      return res.status(404).json({ msg: "Cannot find a movie for this id" });
    }
    if (role === "admin") {
      movie.title = title;
      movie.desc = desc;
      movie.image = image;
      movie.trailer = trailer;
      movie.video = video;
      movie.year = year;
      movie.genre = genre;
      //   movie.likes = likes;
      //   movie.comments = comments;
      //   if (image) advertisment.image = image;

      await movie.save();

      return res.status(202).json({
        msg: "Movie updated successfully",
        movie,
      });
    }

    return res.status(404).json({
      msg: "You don't have access to perform this task",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const deleteMovie = async (req, res, next) => {
  const { mId } = req.body;
  const userRole = req.user.role;

  try {
    let movie = await Movie.findById(mId);
    if (!movie) {
      return res.status(404).json({ msg: "Cannot find a movie for this id" });
    }
    if (userRole === "admin") {
      await movie.remove();

      return res.status(200).json({ msg: "Movie removed successfully" });
    }

    return res.status(404).json({
      msg: "You don't have access to perform this task",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

const addComment = async (req, res, next) => {
  const { mId, comment } = req.body;
  const userId = req.user.id;

  let movie;
  try {
    movie = await Movie.findById(mId);
    if (!movie) {
      return res.status(404).json({ msg: "Cannot find a movie" });
    }

    let newComment = new Comment({
      user: userId,
      movieId: mId,
      comment: comment,
      date: Date.now(),
    });

    await newComment.save();

    movie.comments.unshift(newComment);
    await movie.save();

    return res.status(200).json({ msg: "comment added successfully", newComment });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

//DELETE

// router.delete('/:id', async (req, res) => {
// 	try {
// 		await Movie.findByIdAndDelete(req.params.id);
// 		res.status(200).json('The movie has been deleted...');
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

//GET

const getMovieById = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id);
		res.status(200).json(movie);
	} catch (err) {
		res.status(500).json(err);
	}
};

// //GET RANDOM

// router.get('/random', async (req, res) => {
// 	const type = req.query.type;
// 	let movie;
// 	try {
// 		if (type === 'series') {
// 			movie = await Movie.aggregate([
// 				{ $match: { isSeries: true } },
// 				{ $sample: { size: 1 } }
// 			]);
// 		} else {
// 			movie = await Movie.aggregate([
// 				{ $match: { isSeries: false } },
// 				{ $sample: { size: 1 } }
// 			]);
// 		}
// 		res.status(200).json(movie);
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

//GET ALL

// router.get('/', async (req, res) => {
// 	try {
// 		const movies = await Movie.find();
// 		res.status(200).json(movies.reverse());
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

//get movie by genre
const getMovieByGenre = async (req, res, next) => {
  try {
    const movies = await Movie.find({ genre: req.params.genre });
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json(err);
  }
};

//like/dislike a post

const likePost = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie.likes.includes(req.body.userId)) {
      await movie.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The movie has been liked");
    } else {
      await movie.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The movie has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const addAdvertisment = async (req, res, next) => {
  const { userId, title, image, description } = req.body;
  //const userId = req.user.id;

  try {
    let advertisment = new Advertisment({
      user: userId,
      title,
      image,
      description,
    });

    await advertisment.save();

    return res
      .status(200)
      .json({ msg: "Advertisment created successfully", advertisment });
  } catch (err) {
    return res.status(500).json({
      msg: err,
    });
  }
};

exports.addAdvertisment = addAdvertisment;
exports.getMovies = getMovies;
exports.addMovie = addMovie;
exports.getMovieById = getMovieById;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;
exports.addComment = addComment;
exports.getMovieByGenre = getMovieByGenre;
exports.likePost = likePost;
