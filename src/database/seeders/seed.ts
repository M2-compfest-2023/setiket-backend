import { PrismaClient } from '@prisma/client';

import categorySeeder from './category.seeder';
import { citySeeder } from './city.seeder';
import eventsSeeder from './events.seeder';
import { provinceSeeder } from './province.seeder';
import usersSeeder from './users.seeder';

const prisma = new PrismaClient();

async function main() {
    await provinceSeeder();
    await citySeeder();
    await categorySeeder();

    await usersSeeder();
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
