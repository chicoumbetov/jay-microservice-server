import { Channel } from "amqplib";

const express = require("express");
const cors = require("cors");
const { shopping } = require("./api");

const HandleErrors = require("./utils/error-handler");

module.exports = async (app: any, channel: Channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // * Listen to Events from other Services
  // * appEvents(app);
  // * Replaced by Message Broker by passing channel prop

  //api
  // customer(app);
  // products(app);
  shopping(app, channel);

  // * error handling
  app.use(HandleErrors);
};
