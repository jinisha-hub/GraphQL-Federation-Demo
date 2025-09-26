import { gql } from "graphql-tag";
import { PrismaClient } from "../generated/project";
import { request, gql as gqlRequest } from "graphql-request";

const prisma = new PrismaClient();
const CLIENT_SERVICE_URL = "http://localhost:4002/graphql"; // client-service

// -------------------- Types --------------------
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface GetClientResponse {
  client: Client | null;
}

// -------------------- SDL --------------------
export const typeDefs = gql`
  type Client @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
    phone: String!
  }

  type Project @key(fields: "id") {
    id: ID!
    name: String!
    description: String!
    status: String!
    client: Client!
  }

  type Query {
    projects: [Project!]!
  }

  type Mutation {
    addProject(
      name: String!
      description: String!
      status: String!
      clientId: ID!
    ): Project!
    deleteProject(id: ID!): Project!
    deleteAllProjects: Boolean!
  }
`;

// -------------------- Resolvers --------------------
export const resolvers = {
  Query: {
    projects: () => prisma.project.findMany(),
  },

  Mutation: {
    addProject: async (
      _: unknown,
      args: { name: string; description: string; status: string; clientId: string }
    ) => {
      // 🔍 Verify client exists in client-service before creating
      const { client } = await request<GetClientResponse>(
        CLIENT_SERVICE_URL,
        gqlRequest`
          query GetClient($id: ID!) {
            client(id: $id) { id }
          }
        `,
        { id: String(args.clientId) } // ensure string
      );

      if (!client) {
        throw new Error(`Client with id ${args.clientId} does not exist`);
      }

      return prisma.project.create({
        data: {
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: Number(args.clientId), // DB expects number
        },
      });
    },

    deleteProject: async (_: unknown, args: { id: string }) => {
      return prisma.project.delete({ where: { id: Number(args.id) } });
    },

    deleteAllProjects: async () => {
      await prisma.project.deleteMany({});
      return true;
    },
  },

  Project: {
    client: async (parent: { clientId: number }) => {
      const { client } = await request<GetClientResponse>(
        CLIENT_SERVICE_URL,
        gqlRequest`
          query GetClient($id: ID!) {
            client(id: $id) {
              id
              name
              email
              phone
            }
          }
        `,
        { id: String(parent.clientId) } // 🔑 cast to string for client-service
      );

      if (!client) {
        throw new Error(
          `Client with id ${parent.clientId} not found in client-service`
        );
      }

      return client;
    },
  },
};
