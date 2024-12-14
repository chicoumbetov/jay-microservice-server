const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  GATEWAY_PORT,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
} = require("../config");

//Utility functions
export const GenerateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
): Promise<boolean> => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (
  payload: object
): Promise<string | Error> => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log("Error in GenerateSignature", error);
    return error instanceof Error
      ? error
      : new Error("Unknown error occurred during signature generation");
  }
};

export const ValidateSignature = async (req: any) => {
  try {
    const signature = req.get("Authorization");
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data: any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//*-------------------------------- Message Broker -------------------------------- */
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);

    const channel = await connection.createChannel();

    if (channel) {
      console.log("------Products Message Broker Channel Created------");
    }

    // * Exchange Distributor
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
    // throw new Error
    console.log(`CreateChannel error of Message Broker ${error}`);
  }
};

module.exports.PublishMessage = async (
  channel: any,
  binding_key: string,
  message: string
) => {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("----Message has been sent from Products MS----", message);
  } catch (error) {
    // throw new Error
    console.log(`PublishMessage error of Message Broker  ${error}`);
  }
};

module.exports.SubscribeMessage = async (
  channel: any,
  service: any,
  binding_key: string
) => {
  try {
    const appQueue = await channel.asserQueue("QUEUE_NAME");
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
    channel.consume(appQueue.queue, (data: any) => {
      console.log("SubscribeMessage received data");
      console.log("data.content:", data.content.toString());

      channel.ack(data);
    });
  } catch (error) {
    throw new Error(`SubscribeMessage error of Message Broker ${error}`);
  }
};

// * ---------- REPLACED by message broker above  ---------- * //
/*
export const PublishCustomerEvent = async (payload: any) => {
  try {
    axios.post(`http://localhost:${GATEWAY_PORT}/customer/app-events`, {
      payload,
    });
  } catch {
    throw new Error("PublisherCustomerEvent error !");
  }
};

export const PublishShoppingEvent = async (payload: any) => {
  try {
    axios.post(`http://localhost:${GATEWAY_PORT}/shopping/app-events`, {
      payload,
    });
  } catch {
    throw new Error("PublisherShoppingEvent error !");
  }
};
*/
