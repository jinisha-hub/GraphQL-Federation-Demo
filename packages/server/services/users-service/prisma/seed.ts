import { PrismaClient } from "../generated/user";
import { users } from "../../../seed-data/sampleData";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const usersWithHashed = users.map(u => ({
    ...u,
    password: bcrypt.hashSync(u.password, 10), // hash password
  }));

  await prisma.user.createMany({
    data: usersWithHashed,
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("✅ Users seeded"))
  .catch((e) => console.error("❌ Error seeding users:", e))
  .finally(() => prisma.$disconnect());
