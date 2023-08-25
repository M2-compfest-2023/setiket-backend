import { PrismaClient } from '@prisma/client';

import categories from './data/categories.json';

const prisma = new PrismaClient();

export default async function categorySeeder() {
    try {
        for (const category of categories) {
            await prisma.category.upsert({
                where: {
                    id: category.id,
                },
                update: category,
                create: category,
            });
        }

        console.log('Event categories seeded successfully');
    } catch (error) {
        console.error('Error seeding event categories:', error);
    } finally {
        await prisma.$disconnect();
    }
}
