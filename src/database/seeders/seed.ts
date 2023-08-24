import { PrismaClient } from '@prisma/client';
import usersSeeder from './users.seeder';
import categorySeeder from './category.seeder';
import eventsSeeder from './events.seeder';
import { citySeeder } from "./city.seeder";
import { provinceSeeder } from "./province.seeder";

const prisma = new PrismaClient();

async function main() {
  await usersSeeder();
  await categorySeeder();
  await provinceSeeder();
  await citySeeder();
  await eventsSeeder();
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
