const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PRODUCTS_PORT,
  GATEWAY_PORT: process.env.GATEWAY_PORT,
  DB_URL: process.env.MONGODB_URI,
  LOCAL_DB_URL: process.env.LOCAL_MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,

  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "ONLINE_SHOPPING", // process.env.EXCHANGE_NAME,
  SHOPPING_BINDING_KEY: "SHOPPING_SERVICE",
  CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
};
