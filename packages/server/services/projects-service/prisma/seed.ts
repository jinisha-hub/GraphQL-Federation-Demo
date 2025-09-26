import { PrismaClient } from "../generated/project";
import { projects } from "../../../seed-data/sampleData";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: projects,
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("✅ Projects seeded"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
