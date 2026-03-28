import { prisma } from "../db/index.db.js";

export const taskResolver = {
  Query: {
    tasks: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const role = user.role;
      if (role === "ADMIN") {
        const tasks = await prisma.task.findMany({
          where: {
            createdById: user.id,
          },
        });
        return tasks;
      } else if (role === "USER") {
        const tasks = await prisma.task.findMany({
          where: {
            OR: [{ assignedToId: user.id }, { createdById: user.id }],
          },
        });
        return tasks;
      } else {
        throw new Error("Invalid role");
      }
    },
  },
  Mutation: {
    createTask: async (_, { title }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const task = await prisma.task.create({
        data: {
          title,
          assignedToId: user.id,
          createdById: user.id,
        },
      });

      return task;
    },
    assignTask: async (_, { title, userIds }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      if (user.role !== "ADMIN") {
        throw new Error("Required Role ADMIN");
      }

      userIds = [...new Set(userIds)];

      if (userIds.length === 0) {
        throw new Error("User Ids are required");
      }

      let targetUsers = await prisma.user.findMany({
        where: { id: { in: userIds } },
      });

      if (targetUsers.length !== userIds.length) {
        throw new Error("Some users are invalid");
      }

      let taskPromises = targetUsers.map((u) => {
        return prisma.task.create({
          data: {
            title,
            createdById: user.id,
            assignedToId: u.id,
          },
        });
      });

      return Promise.all(taskPromises);
    },
  },
};
