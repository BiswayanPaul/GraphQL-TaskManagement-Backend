import bcrypt from "bcrypt";
import { prisma } from "../db/index.db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.js";

export const authResolver = {
  Query: {
    me: (_, __, { user }) => {
      return user || null;
    },
  },

  Mutation: {
    register: async (_, { email, password }) => {
      const hashed = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          password: hashed,
        },
      });

      return "User registered";
    },

    login: async (_, { email, password }, { res }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const accessToken = generateAccessToken({
        id: user.id,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        id: user.id,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });

      return "Logged in";
    },
  },
};
