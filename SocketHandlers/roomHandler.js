const dataMemberChangeHandler = require("./dataMemberChangeHandler");
const Room = require("../Db/room");
function setupRoomHandlers(io, socket) {
  // Join Newly created Room
  socket.on("join room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    socket.emit("room joined", roomId);
  });
  //Join existing room
  socket.on("join existing room", async ({ roomId }) => {
    const room = await Room.findById(roomId);
    if (room) {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
      socket.emit("existing room joined", room);
    } else socket.emit("no room", { msg: "Room doesn't exists" });
  });
  // any change in room properties like code content , language , input
  dataMemberChangeHandler(io, socket);
  //Leave room
  socket.on("leave room", (room, userId) => {
    socket.leave(room);
    console.log(
      `User ${socket.id} left room: ${room} whose userId is: ${userId}`
    );
    socket.emit("room left", room);

    // Optionally, notify other users in the room
    socket
      .to(room)
      .emit("user left", { userId: userId, socketId: socket.id, room: room });
  });
}

module.exports = setupRoomHandlers;
