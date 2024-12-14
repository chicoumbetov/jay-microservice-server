import { Channel } from "amqplib";

const amqplib = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  CUSTOMER_BINDING_KEY,
} = require("../config");

//*----------- Message Broker ------------------- */
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);

    const channel = await connection.createChannel();
    if (channel) {
      console.log("-----Customer Message Broker Channel Created-------");
    }

    // * Exchange Distributor
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
    // throw new Error
    console.log(`CreateChannel error of Message Broker ${error}`);
  }
};

module.exports.SubscribeMessage = async (channel: Channel, service: any) => {
  try {
    const appQueue = await channel?.assertQueue(QUEUE_NAME);
    channel?.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
    channel?.consume(appQueue.queue, (data: any) => {
      console.log("---Customer MS SubscribeMessage received data---");
      console.log("data.content:", data.content.toString());

      channel?.ack(data);
    });
  } catch (error) {
    // throw new Error(
    console.log(`SubscribeMessage error of Message Broker ${error}`);
  }
};
