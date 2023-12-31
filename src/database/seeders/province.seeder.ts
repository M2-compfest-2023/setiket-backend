import { Prisma, PrismaClient } from '@prisma/client';
import csv from 'csvtojson';

const prisma = new PrismaClient();

export const provinceSeeder = async () => {
    await csv()
        .fromFile(__dirname + '/data/province.csv')
        .then(async (provs) => {
            for (const idx in provs) {
                const prov = provs[idx];
                const provData: Prisma.ProvinceUncheckedCreateInput = {
                    id: parseInt(prov.id),
                    name: prov.name,
                };

                await prisma.province.upsert({
                    where: {
                        id: parseInt(prov.id),
                    },
                    update: provData,
                    create: provData,
                });
            }
            console.log('Province seeded successfully');
        });
};
