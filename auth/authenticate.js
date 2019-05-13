const jwt = require("jsonwebtoken");

const jwtKey =
  process.env.JWT_SECRET ||
  "add a .env file to root of project with the JWT_SECRET variable";

// quickly see what this file exports
module.exports = {
  authenticate,
  generateToken
};

// Middleware
function authenticate(req, res, next) {
  const token = req.get("Authorization");

  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err)
        return res
          .status(401)
          .json({ error: "Bad token. You shall not pass!" });

      req.decoded = decoded;

      next();
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
}

// Token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const secret = jwtKey; // at the top

  const options = {
    expiresIn: "5h"
  };

  return jwt.sign(payload, secret, options);
}
