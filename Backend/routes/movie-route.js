const express = require("express");
const {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  getMovieById,
  addComment,
  getMovieByGenre,
  likePost
} = require("../controllers/movies");
const auth = require("../middleware/Authentication");
const router = express.Router();

router.put("/comment", auth, addComment);
router.get("/find/:id", getMovieById);
router.get("/", getMovies);
router.post("/", auth, addMovie);
router.put("/update", auth, updateMovie);
router.delete("/delete", auth, deleteMovie);
router.get("/movie/:genre", getMovieByGenre);
router.put("/:id/like", likePost);

module.exports = router;
