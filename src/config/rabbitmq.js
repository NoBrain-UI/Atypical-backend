const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL
  );

  channel = await connection.createChannel();

  await channel.assertExchange(
    "orders_exchange",
    "topic",
    { durable: true }
  );

  console.log("RabbitMQ Connected");
}

function getChannel() {
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel,
};