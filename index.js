import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import mongoose from "mongoose";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  typeDefs as scalarsTypedefs,
  resolvers as scalarsResolvers,
} from "graphql-scalars";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import "dotenv/config";

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, ...scalarsTypedefs],
    resolvers: { ...resolvers, ...scalarsResolvers },
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    context: () => ({}),
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  //   server.applyMiddleware({ app, path: "/toto" });
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(
    `Serveur actif sur l'url suivante : http://localhost:4000${server.graphqlPath}`
  );

  mongoose
    .connect(`${process.env.MONGO_URI}`, {
      autoIndex: true,
    })
    .then(() => console.log("Connecté à la base de données"))
    .catch((err) => console.log(err));
}
startApolloServer();
