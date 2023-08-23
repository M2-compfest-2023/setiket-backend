const csv = require('csvtojson');

export const citySeeder = async () => {
  await csv()
    .fromFile(__dirname + '/data/city.csv')
    .then(async (cities) => {
      for(let idx in cities) {
        const city = cities[idx]

      }
  });
};
