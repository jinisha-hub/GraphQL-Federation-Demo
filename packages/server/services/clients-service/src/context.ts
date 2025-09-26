import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

// Function to build context for Apollo Server
export function buildContext(): Context {
  return { prisma };
}
