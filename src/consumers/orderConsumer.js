const { getChannel } =
require("../config/rabbitmq");

async function startConsumer(io) {

  const channel = getChannel();

  const q = await channel.assertQueue(
    "orders_queue",
    {
      durable: true,
    }
  );

  await channel.bindQueue(
    q.queue,
    "orders_exchange",
    "order.*"
  );

  console.log(
    "Consumer Started"
  );

  channel.consume(
    q.queue,
    (msg) => {

      if (!msg) return;

      const data =
        JSON.parse(
          msg.content.toString()
        );

      console.log(
        "Consumed:",
        data
      );

      io.emit(
        "order-update",
        data
      );

      channel.ack(msg);
    }
  );
}

module.exports = {
  startConsumer,
};