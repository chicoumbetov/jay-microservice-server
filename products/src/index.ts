const { app } = require("./socket/server");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");

async function start() {
  await databaseConnection();

  await expressApp(app);

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
