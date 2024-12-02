import { appEvents } from "./api/app-events";

const express = require("express");
const cors = require("cors");
const { shopping } = require("./api");

const HandleErrors = require("./utils/error-handler");

module.exports = async (app: any) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // * Listen to Events from other Services
  appEvents(app);

  //api
  // customer(app);
  // products(app);
  shopping(app);

  // * error handling
  app.use(HandleErrors);
};
