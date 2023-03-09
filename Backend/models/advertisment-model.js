const mongoose = require('mongoose');

const AdvertismentSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	description: {
		type: String,
		require: true
	},
	title: {
		type: String,
		require: true
	},
	image: {
		type: String,
		require: true
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	date: {
		type: Date
	}
});

module.exports = mongoose.model('Advertisment', AdvertismentSchema);
