const amqplib = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  CUSTOMER_BINDING_KEY,
} = require("../config");

//*-------------------------------- Message Broker -------------------------------- */
// TODO: create a channel
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);

    const channel = await connection.createChannel();
    console.log("channel :", channel);

    // * Exchange Distributor
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
    // throw new Error
    console.log(`CreateChannel error of Message Broker ${error}`);
  }
};

// TODO: subscribe messages
module.exports.SubscribeMessage = async (channel: any, service: any) => {
  try {
    const appQueue = await channel.asserQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
    channel.consume(appQueue.queue, (data: any) => {
      console.log("SubscribeMessage received data");
      console.log("data.content:", data.content.toString());

      channel.ack(data);
    });
  } catch (error) {
    throw new Error(`SubscribeMessage error of Message Broker ${error}`);
  }
};
