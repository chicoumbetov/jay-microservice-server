const express = require("express");
const cors = require("cors");
const { customer } = require("./api");

// ! extracted to separate microservice
// , products, shopping

const HandleErrors = require("./utils/error-handler");

module.exports = async (app: any, channel: any) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // * Listen to Events from other Services
  // * appEvents(app); // Event Driven Updates Replaced by passing channel props of Message Broker

  //api
  customer(app, channel);
  // products(app);
  // shopping(app);

  // error handling
  app.use(HandleErrors);
};
