import express from "express";
import { app } from "./socket/server";
const cors = require("cors");
const proxy = require("express-http-proxy");

async function start() {
  app.use(cors());
  app.use(express.json());

  app.use("/customer", proxy("http://localhost:8005"));
  app.use("/shopping", proxy("http://localhost:8006"));
  app.use("/", proxy("http://localhost:8007")); // * products

  app.listen(8004, () => {
    console.log("Proxy is listening on http://localhost:8004");
  });
  try {
    app.use;
  } catch (error) {
    console.log("server error :", JSON.stringify(error));
  }
}

start();
