import { authResolver } from "./auth.resolver.js";
import { taskResolver } from "./task.resolver.js";
import { taskRequestResolver } from "./taskRequest.resolver.js";

export const resolvers = {
  Query: {
    ...authResolver.Query,
    ...taskResolver.Query,
    ...taskRequestResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...taskResolver.Mutation,
    ...taskRequestResolver.Mutation,
  },
};
