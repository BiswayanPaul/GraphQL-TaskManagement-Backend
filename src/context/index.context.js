import { authMiddleware } from "../middleware/auth.middleware.js";
import { prisma } from "../db/index.db.js";

export const context = async ({ req, res }) => {
  const decoded = authMiddleware(req);

  if (!decoded) {
    return { user: null, req, res };
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  return { user, req, res };
};
