import { PrismaClient } from "../generated/project";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

export function buildContext(): Context {
  return { prisma };
}
