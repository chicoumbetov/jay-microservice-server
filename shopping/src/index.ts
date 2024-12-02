const { app } = require("./socket/server.ts");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");

const start_server = async () => {
  await databaseConnection();

  await expressApp(app);

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
