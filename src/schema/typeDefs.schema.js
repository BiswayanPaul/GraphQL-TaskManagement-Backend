export const typeDefs = `#graphql


enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETION_REQUESTED
  COMPLETED
  REJECTED
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}

enum Role {
  ADMIN
  USER
}

type User {
  id: ID!
  email: String!
  role: Role!
}

type Task {
  id: ID!
  title: String!
  status: TaskStatus!
}

type TaskRequest {
  id: ID!
  taskId: Int!
  requestedById: Int!
  status: RequestStatus!
  rejectionReason: String
}

type TaskActionResponse {
  task: Task!
  request: TaskRequest!
}




type Query {
  me: User
  tasks: [Task]
}


type Mutation {
  register(email: String!, password: String!): String
  login(email: String!, password: String!): String
  createTask(title: String!): Task
  assignTask(title: String!, userIds: [Int]!): [Task]
  startTask(taskId: Int!): Task
  requestCompletion(taskId: Int!): TaskActionResponse
  approveTask(taskId: Int!): TaskActionResponse
  rejectTask(taskId: Int!, reason: String!): TaskActionResponse
  }

`;
