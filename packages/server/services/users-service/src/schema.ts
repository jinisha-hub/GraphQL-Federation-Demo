import gql from "graphql-tag";
import bcrypt from "bcryptjs";
import { generateToken } from "./auth"; // your JWT util
import { Context } from "./context";
import { PrismaClient } from "../generated/user";
import { Role } from "../generated/user";
const prisma = new PrismaClient();

export const typeDefs = gql`
  extend type Query {
    me: User
    users: [User!]!
  }

  extend type Mutation {
    register(email: String!, password: String!, role: String): User
    login(email: String!, password: String!): AuthPayload
    deleteUser(id: ID!): User
  }

  type User @key(fields: "id") {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

export const resolvers = {
  User: {
    __resolveReference(user: { id: number }, { prisma }: Context) {
      return prisma.user.findUnique({ where: { id: Number(user.id) } });
    },
  },
  Query: {
    me: async (_p: any, _a: any, ctx: Context) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return ctx.prisma.user.findUnique({ where: { id: ctx.user.id } });
    },
    users: (_p: any, _a: any, ctx: Context) => ctx.prisma.user.findMany(),
  },
  Mutation: {
    register: async (
      _p: any,
      { email, password, role }: { email: string; password: string; role?: string },
      ctx: Context
    ) => {
      const existing = await ctx.prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("User already exists");

      const hashed = await bcrypt.hash(password, 10);

      // map role string to Prisma enum, default USER
      const userRole: Role =
        role?.toUpperCase() === "SUPERUSER" ? Role.SUPERUSER : Role.USER;

      const user = await ctx.prisma.user.create({
        data: { email, password: hashed, role: userRole },
      });

      return user ;
    },

    login: async (_p: any, { email, password }: any, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      return { token: generateToken(user), user };
    },

    deleteUser: (_p: any, { id }: { id: string }, ctx: Context) =>
      ctx.prisma.user.delete({ where: { id: Number(id) } }),
  },
};