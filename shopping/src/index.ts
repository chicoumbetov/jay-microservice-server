const { app } = require("./socket/server.ts");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");

const { CreateChannel } = require("./utils/message-broker");

const start_server = async () => {
  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`Shopping Server is listening to port ${PORT}`);
    })
    .on("error", (err: any) => {
      console.log(err);
      process.exit();
    });
};

start_server();
