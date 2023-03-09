const mongoose = require('mongoose');
const FavoritesSchema = mongoose.Schema({
   movieId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movie'
	},
    title:{
        type: String
    },
    img:{
        type: String
    },
    year:{
        type: String
    },
    genre:{
        type: String
    }
});

module.exports = mongoose.model('FavoriteMovies',FavoritesSchema)