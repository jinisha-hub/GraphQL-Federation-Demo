import { gql } from "graphql-tag";
import { PrismaClient } from "../generated/client";
import { request, gql as gqlRequest } from "graphql-request";

const prisma = new PrismaClient();
const PROJECT_SERVICE_URL = "http://localhost:4003/graphql"; 

// TypeScript type for response from projects-service
type ProjectType = { id: number; client: { id: number | string } };
type ProjectsResponse = { projects: ProjectType[] };

// -------------------- SDL --------------------
export const typeDefs = gql`
  type Client @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
    phone: String!
    projects: [Project!]!
  }

  type Project @key(fields: "id") {
    id: ID!
    name: String
  }

  type Query {
    client(id: ID!): Client
    clients: [Client!]!
    clientsWithoutProjects: [Client!]!
  }

  type Mutation {
    addClient(name: String!, email: String!, phone: String!): Client
    updateClient(id: ID!, name: String, email: String, phone: String): Client
    deleteClient(id: ID!): Client
    deleteAllClients: Boolean!
  }
`;

// -------------------- Resolvers --------------------
export const resolvers = {
  Client: {
    __resolveReference: async (client: { id: number | string }) => {
      return prisma.client.findUnique({ where: { id: Number(client.id) } });
    },
    projects: async (client: { id: number | string }) => {
      const data: ProjectsResponse = await request(
        PROJECT_SERVICE_URL,
        gqlRequest`
          query {
            projects {
              id
              name
              client { id }
            }
          }
        `
      );
      // Ensure both IDs are strings for proper comparison
      return data.projects.filter((p) => String(p.client?.id) === String(client.id));
    },
  },

  Query: {
    client: async (_: any, args: { id: string | number }) =>
      prisma.client.findUnique({ where: { id: Number(args.id) } }),

    clients: async () => prisma.client.findMany({ orderBy: { id: "asc" } }),

    clientsWithoutProjects: async () => {
      const clients = await prisma.client.findMany();
      const projectsData: ProjectsResponse = await request(
        PROJECT_SERVICE_URL,
        gqlRequest`
          query {
            projects {
              client { id }
            }
          }
        `
      );
      const clientsWithProjects = new Set(
        projectsData.projects.map((p) => String(p.client?.id)).filter(Boolean)
      );
      return clients.filter((c: { id: any }) => !clientsWithProjects.has(String(c.id)));
    },
  },

  Mutation: {
    addClient: async (_: any, args: { name: string; email: string; phone: string }) =>
      prisma.client.create({ data: args }),

    updateClient: async (_: any, args: { id: string; name?: string; email?: string; phone?: string }) =>
      prisma.client.update({
        where: { id: Number(args.id) },
        data: { name: args.name ?? undefined, email: args.email ?? undefined, phone: args.phone ?? undefined },
      }),

    deleteClient: async (_: any, args: { id: string }) => {
      const clientId = Number(args.id);
      try {
        // Fetch projects for this client from projects-service
        const data: ProjectsResponse = await request(
          PROJECT_SERVICE_URL,
          gqlRequest`
            query {
              projects {
                id
                client { id }
              }
            }
          `
        );
        const hasProjects = data.projects.some(
          (p) => p.client && String(p.client.id) === String(clientId)
        );
        if (hasProjects) {
          throw new Error(`Cannot delete client ${clientId}: associated projects exist.`);
        }
        // Safe to delete
        return prisma.client.delete({ where: { id: clientId } });
      } catch (err: any) {
        console.error("Delete failed:", err);
        // Throw error for Apollo to handle
        throw new Error(err.message || "Failed to delete client");
      }
    },

    deleteAllClients: async () => {
      await prisma.client.deleteMany({});
      return true;
    },
  },
};
