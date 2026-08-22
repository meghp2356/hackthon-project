const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return process.env.JWT_SECRET;
};

const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

const generateResetToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "password-reset",
    },
    getJwtSecret(),
    {
      expiresIn: "15m",
    }
  );
};

const verifyResetToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateResetToken,
  verifyResetToken,
};
