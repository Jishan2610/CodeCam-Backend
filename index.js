const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mainRouter = require("./Routes/index");
const cors = require("cors");
const socketIo = require('socket.io');
const setupSocketIO = require('./SocketHandlers/index').default;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});//setting up socket
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

setupSocketIO(io);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database is connected successfully!");
  } catch (err) {
    console.log(err);
  }
};

app.get("/", (req, res) => {
  res.json("Server is up and running");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port: " + process.env.PORT);
});