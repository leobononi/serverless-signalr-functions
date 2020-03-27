const client = require('./db.js');

const databaseDefinition = { id: "stocksdb" };
const collectionDefinition = { id: "stocks" };

const init = async () => {
    const { database } = await client.databases.createIfNotExists(databaseDefinition);
    const { container } = await database.containers.createIfNotExists(collectionDefinition);
    return { database, container };
}

const inserData = async () => {

    const { container } = await init();

    console.log('Read data from database.\n\n');

      const item = {
        "symbol": `new${Math.trunc(Math.random() * (10 - 1) + 1)}`,
        "price": 104.23,
        "change": 10.56,
        "changeDirection": '+'
      };

      await container.items.create(item);

      console.log(`Data inserted: ${JSON.stringify(item)}`);
};

inserData().catch(err => {
    console.error(err);
});
