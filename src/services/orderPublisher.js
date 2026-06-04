const { getChannel } = require("../config/rabbitmq");

async function publishOrderEvent(routingKey, payload) {
  try {
    const channel = getChannel();

    channel.publish(
      "orders_exchange",
      routingKey,
      Buffer.from(JSON.stringify(payload))
    );

    console.log(
      `Published Event: ${routingKey}`
    );

  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  publishOrderEvent,
};