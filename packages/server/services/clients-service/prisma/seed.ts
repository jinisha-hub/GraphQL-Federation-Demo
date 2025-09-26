import { PrismaClient } from "../generated/client";
import { clients } from "../../../seed-data/sampleData";

const prisma = new PrismaClient();

async function main() {
  await prisma.client.createMany({
    data: clients,
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("✅ Clients seeded"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
