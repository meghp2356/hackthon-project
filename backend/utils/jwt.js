import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateResetToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "password-reset",
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};