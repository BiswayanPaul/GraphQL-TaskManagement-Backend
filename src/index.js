import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { typeDefs } from "./schema/typeDefs.schema.js";
import { resolvers } from "./resolvers/index.resolver.js";
import { context } from "./context/index.context.js";

async function start() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/graphql", expressMiddleware(server, { context }));

  app.listen(8000, () => {
    console.log("🚀 http://localhost:8000/graphql");
  });
}

start();
