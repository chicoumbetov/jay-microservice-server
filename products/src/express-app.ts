import { Channel } from "amqplib";

const express = require("express");
const cors = require("cors");
const { products } = require("./api");

// ! extracted to separate microservice
// , products, shopping

const HandleErrors = require("./utils/error-handler");

module.exports = async (app: any, channel: Channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // * Listen to Events from other Services
  // * REPLACED BY PASSING CHANNEL AS MESSAGE BROKER LISTENER
  // appEvents(app);

  //api
  // customer(app);
  products(app, channel);
  // shopping(app);

  // error handling
  app.use(HandleErrors);
};
