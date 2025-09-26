import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { typeDefs, resolvers } from "./schema";
import { buildContext } from "./context"; 

async function start() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });

  // Pass context here instead of ApolloServer constructor
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 },
    context: async () => buildContext(), // ✅ context goes here
  });

  console.log(`🚀 Project service ready at ${url}`);
}

start();
