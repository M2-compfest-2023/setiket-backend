import { PrismaClient } from '@prisma/client';

import events from './data/events.json';

const prisma = new PrismaClient();

export default async function eventsSeeder() {
    try {
        // for (const event of events) {
        //   await prisma.event.upsert({
        //     where: {
        //       id: event.id,
        //     },
        //     update: event,
        //     create: event,
        //   });
        // }

        const eo = await prisma.eventOrganizer.findFirst();
        for (const event of events) {
            event.organizer_id = eo.id;
            await prisma.event.upsert({
                where: {
                    id: event.id,
                },
                create: event,
                update: event,
            });
        }

        console.log('Events seeded successfully');
    } catch (error) {
        console.error('Error seeding events:', error);
    } finally {
        await prisma.$disconnect();
    }
}
