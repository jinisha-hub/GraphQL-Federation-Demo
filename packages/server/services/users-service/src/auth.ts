import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function generateToken(user: { id: number; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function requireAuth(user?: { id: number; role: string }, role?: "USER" | "SUPERUSER") {
  if (!user) throw new Error("Not authenticated");
  if (role && user.role !== role) throw new Error("Not authorized");
}
