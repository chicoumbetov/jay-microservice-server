const { amqplib } = require("amqplib");

const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  SHOPPING_BINDING_KEY,
  QUEUE_NAME,
} = require("../config");

//*-------------------------------- Message Broker -------------------------------- */
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);

    const channel = await connection.createChannel();

    if (channel) {
      console.log("------Shopping Message Broker Channel Created------");
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
    console.log("----Message has been sent from Shopping MS----", message);
  } catch (error) {
    // throw new Error
    console.log(`PublishMessage error of Message Broker  ${error}`);
  }
};

module.exports.SubscribeMessage = async (channel: any, service: any) => {
  try {
    const appQueue = await channel.asserQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
    channel.consume(appQueue.queue, (data: any) => {
      console.log("Shopping MS SubscribeMessage Received Data");
      console.log("data.content:", data.content.toString());

      channel.ack(data);
    });
  } catch (error) {
    throw new Error(
      `SubscribeMessage error of Shopping Message Broker ${error}`
    );
  }
};
