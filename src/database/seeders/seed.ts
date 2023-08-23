import { PrismaClient } from "@prisma/client";
import usersSeeder from "./users.seeder";
import { citySeeder } from "./city.seeder";

const prisma = new PrismaClient();

async function main() {
  await usersSeeder()
  await citySeeder()
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
