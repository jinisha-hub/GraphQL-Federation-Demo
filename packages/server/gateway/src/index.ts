import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
(global as any).fetch = fetch; // required for ApolloGateway in Node

async function waitForService(url: string, retries = 20, delay = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "{ _service { sdl } }" }),
      });

      if (res.ok) {
        console.log(`✅ Service ready at ${url}`);
        return;
      }
    } catch (e) {
      console.log(`⏳ Waiting for service at ${url}... (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(`❌ Service at ${url} not available`);
}

async function startGateway() {
  // wait for all subgraphs
  await waitForService("http://localhost:4001/graphql"); // users-service
  await waitForService("http://localhost:4002/graphql"); // client-service
  await waitForService("http://localhost:4003/graphql"); // projects-service

  console.log("🚀 All services are up. Starting Gateway...");

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "user1", url: "http://localhost:4001/graphql" },
        { name: "client2", url: "http://localhost:4002/graphql" },
        { name: "project3", url: "http://localhost:4003/graphql" },
      ],
    }),
  });

  const server = new ApolloServer({ gateway });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 5000 },
  });

  console.log(`🚀 Gateway ready at ${url}`);
}

startGateway();
