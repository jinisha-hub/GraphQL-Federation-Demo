import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { typeDefs, resolvers } from "./schema";
import { buildContext } from "./context";

async function start() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4003 },
    context: async () => buildContext(), // context provided here
  });

  console.log(`🚀 Project service ready at ${url}`);
}

start();
