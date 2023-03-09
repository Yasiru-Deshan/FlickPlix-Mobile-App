const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

//Routes
const commentRoute = require("./routes/comment");
const playlistRoute = require("./routes/playlist");
const movieRoutes = require("./routes/movie-route");
const userRoutes = require("./routes/user-route");


const app = express();
app.use(cors());
connectDB();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

//Init middleware
app.use(express.json({ extended: false }));

app.use("/api/auth", userRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/playlists", playlistRoute);
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 8071;

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static('./../Frontend/build'));
// }

// // Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../Frontend/build')));

// // All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../Frontend/build', 'index.html'));
// });

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
