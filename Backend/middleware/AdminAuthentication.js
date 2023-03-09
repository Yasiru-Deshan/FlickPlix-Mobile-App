const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
	//Get token from header
	const token = req.header('x-auth-token');

	//check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authentication denied' });
	}

	//verify token

	try {
		const decode = jwt.verify(token, 'flickplix');

		req.user = decode.user;
		if (req.user.role != 'admin') {
			return res
				.status(408)
				.json({ msg: "You don't have access to perform this task" });
		}
		next();
	} catch (err) {
		res.status(401).json({ msg: 'token is not valid' });
	}
};
