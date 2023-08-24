import { Prisma, PrismaClient } from '@prisma/client';
const csv = require('csvtojson');

const prisma = new PrismaClient();

export const citySeeder = async () => {
  await csv()
    .fromFile(__dirname + '/data/city.csv')
    .then(async (cities) => {
      for (let idx in cities) {
        const city = cities[idx];
        const cityData: Prisma.CityUncheckedCreateInput = {
          id: parseInt(city.id),
          name: city.name,
          province_id: parseInt(city.provinsi_id),
        };

        await prisma.city.upsert({
          where: {
            id: parseInt(city.id),
          },
          update: cityData,
          create: cityData,
        });
      }
      console.log('City seeded successfully');
    });
};
