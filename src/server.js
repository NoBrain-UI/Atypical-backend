require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const {
  connectRabbitMQ,
} = require("./config/rabbitmq");

const {
  startConsumer,
} = require("./consumers/orderConsumer");

const orderRoutes =
  require("./routes/orderRoutes");

const app = express();

app.use(cors());

app.use(express.json());

// Serve Frontend
app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

app.use("/orders", orderRoutes);

// Socket.IO Setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  console.log(
    `Client Connected: ${socket.id}`
  );

  socket.on("disconnect", () => {

    console.log(
      `Client Disconnected: ${socket.id}`
    );

  });

});

const PORT =
  process.env.PORT || 5000;

async function startServer() {

  try {

    await connectRabbitMQ();

    await startConsumer(io);

    server.listen(PORT, () => {

      console.log(
        `Server running on ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "Server startup failed:",
      error
    );

  }

}

startServer();

module.exports = {
  io,
};