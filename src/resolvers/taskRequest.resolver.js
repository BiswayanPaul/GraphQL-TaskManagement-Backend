import { prisma } from "../db/index.db.js";

export const taskRequestResolver = {
  Query: {},
  Mutation: {
    startTask: async (_, { taskId }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const existingTask = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });
      if (!existingTask) {
        throw new Error("No Task Found");
      }
      const userAssignedToTheTaskId = existingTask.assignedToId;
      if (userAssignedToTheTaskId !== user.id) {
        throw new Error("Task not assigned to this user");
      }
      if (
        existingTask.status !== "PENDING" &&
        existingTask.status !== "REJECTED"
      ) {
        throw new Error("Task status should be either PENDING or REJECTED");
      }

      const task = await prisma.task.update({
        where: { id: existingTask.id },
        data: { status: "IN_PROGRESS" },
      });

      return task;
    },
    requestCompletion: async (_, { taskId }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const existingTask = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });
      if (!existingTask) {
        throw new Error("No Task Found");
      }
      const userAssignedToTheTaskId = existingTask.assignedToId;
      if (userAssignedToTheTaskId !== user.id) {
        throw new Error("Task not assigned to this user");
      }
      if (existingTask.status !== "IN_PROGRESS") {
        throw new Error("Task status should be IN_PROGRESS");
      }

      //TODO: Need to add Transaction here or 2 simultaneous call would bypass this and duplication issue will come
      const existingTaskRequest = await prisma.taskRequest.findFirst({
        where: { taskId, status: "PENDING" },
      });
      if (existingTaskRequest) {
        throw new Error("A request with the same task id already exist");
      }

      const newTaskRequest = await prisma.taskRequest.create({
        data: { taskId, requestedById: user.id },
      });
      const updatedExistingTask = await prisma.task.update({
        where: { id: existingTask.id },
        data: { status: "COMPLETION_REQUESTED" },
      });

      return {
        task: updatedExistingTask,
        request: newTaskRequest,
      };
    },
    approveTask: async (_, { taskId }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      if (user.role !== "ADMIN") {
        throw new Error("Only ADMIN has access");
      }
      const existingTask = await prisma.task.findFirst({
        where: {
          id: taskId,
          status: "COMPLETION_REQUESTED",
        },
      });
      if (!existingTask) {
        throw new Error("No Task Found or not in COMPLETION_REQUESTED state");
      }

      if (existingTask.createdById !== user.id) {
        throw new Error("Not Authorized to approve this task");
      }

      const existingPendingTaskCompletionRequest =
        await prisma.taskRequest.findFirst({
          where: {
            taskId,
            status: "PENDING",
          },
        });
      if (!existingPendingTaskCompletionRequest) {
        throw new Error("No pending completion request found");
      }

      const approvedTaskCompletionRequest = await prisma.taskRequest.update({
        where: {
          id: existingPendingTaskCompletionRequest.id,
        },
        data: {
          status: "APPROVED",
        },
      });
      const approvedUpdatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: "COMPLETED",
        },
      });

      return {
        task: approvedUpdatedTask,
        request: approvedTaskCompletionRequest,
      };
    },
    rejectTask: async (_, { taskId, reason }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      if (user.role !== "ADMIN") {
        throw new Error("Only ADMIN has access");
      }
      const existingTask = await prisma.task.findFirst({
        where: {
          id: taskId,
          status: "COMPLETION_REQUESTED",
        },
      });
      if (!existingTask) {
        throw new Error("No Task Found or not in COMPLETION_REQUESTED state");
      }

      if (existingTask.createdById !== user.id) {
        throw new Error("Not Authorized to reject this task");
      }

      const existingPendingTaskCompletionRequest =
        await prisma.taskRequest.findFirst({
          where: {
            taskId,
            status: "PENDING",
          },
        });
      if (!existingPendingTaskCompletionRequest) {
        throw new Error("No pending completion request found");
      }

      const rejectedTaskCompletionRequest = await prisma.taskRequest.update({
        where: {
          id: existingPendingTaskCompletionRequest.id,
        },
        data: {
          status: "REJECTED",
          rejectionReason: reason,
          rejectedById: user.id,
        },
      });
      const rejectedUpdatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });

      return {
        task: rejectedUpdatedTask,
        request: rejectedTaskCompletionRequest,
      };
    },
  },
};
