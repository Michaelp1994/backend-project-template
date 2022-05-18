import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import cors from "cors";
import path from "path";
import { buildSchema } from "type-graphql";

import { dataSource } from "./dataSource";
import { authChecker } from "./services/authChecker";
import { contextGenerator } from "./services/contextGenerator";
const graphqlPath = "/graphql";

async function startServer() {
    const PORT = process.env.PORT;
    if (!PORT) throw Error("Port is not properly configured in env variables.");
    const app = express();
    const httpServer = http.createServer(app);
    const schema = await buildSchema({
        resolvers: [path.join(__dirname, "resolvers", "**", "*.{ts,js}")],
        authChecker: authChecker,
        emitSchemaFile: {
            path: path.join(__dirname, "schema.graphql"),
            sortedSchema: false,
        },
    });
    app.use(cors());

    await dataSource.initialize();
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: contextGenerator,
    });
    await server.start();
    server.applyMiddleware({ app, path: graphqlPath });

    httpServer.listen({ port: PORT });

    console.log(`🚀 Server ready at localhost:${PORT}`);
}

startServer();
