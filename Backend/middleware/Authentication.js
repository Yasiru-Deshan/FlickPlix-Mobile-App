const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authentication denied" });
  }

  //verify token

  try { 
    const decode = jwt.verify(token, "flickplix");

    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "token is not valid" });
  }
};
