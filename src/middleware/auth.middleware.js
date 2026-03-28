import { verifyAccessToken } from "../utils/jwt.utils.js";

export const authMiddleware = (req) => {
  const token = req.cookies.accessToken;

  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
};
