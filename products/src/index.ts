const { app } = require("./socket/server");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");

const { CreateChannel } = require("./utils/index");

async function start() {
  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  app.listen(PORT, () => {
    console.log(`Products is listening on http://localhost:${PORT}`);
  });
  try {
    app.use;
  } catch (error) {
    console.log("Products server error :", JSON.stringify(error));
  }
}

start();
