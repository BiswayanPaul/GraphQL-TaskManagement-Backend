import jwt from "jsonwebtoken";

const ACCESS_SECRET = "access_secret";
const REFRESH_SECRET = "refresh_secret";

export const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    ACCESS_SECRET,
    { expiresIn: "15m" },
  );

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
