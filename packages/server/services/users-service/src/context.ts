import { PrismaClient} from "../generated/user";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "http"; // <-- we'll use this type

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface Context {
  prisma: PrismaClient;
  user?: { id: number; role: string };
}

export function buildContext({ req }: { req: IncomingMessage }): Context {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7) // remove "Bearer "
    : undefined;

  let user;
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    } catch {
      user = undefined;
    }
  }

  return { prisma, user };
}
