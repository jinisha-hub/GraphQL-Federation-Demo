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
    listen: { port: 4001 },
    context: async ({ req }) => buildContext({ req }), // provide context for auth & Prisma
  });

  console.log(`🚀 User service ready at ${url}`);
}

start();
