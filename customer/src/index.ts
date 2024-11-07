import express from "express";
import { app } from "./socket/server";

async function start() {
  app.use(express.json());

  app.use("/", (req, res, next) => {
    return res.status(200).json({ msg: "Hello from Customer Server " });
  });

  app.listen(8005, () => {
    console.log("Customer Server is listening on http://localhost:8005");
  });
  try {
    app.use;
  } catch (error) {
    console.log("server error :", JSON.stringify(error));
  }
}

start();
