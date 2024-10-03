const dataMemberChangeHandler=require("./dataMemberChangeHandler");
function setupRoomHandlers(io, socket) {
    // Join Room
    socket.on('join room', ({roomId}) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
      socket.emit('room joined', roomId);
    });
    // any change in room properties like code content , language , input 
    dataMemberChangeHandler(io,socket);
    //Leave room
    socket.on('leave room', (room,userId) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room} whose userId is: ${userId}`);
        socket.emit('room left', room);
    
        // Optionally, notify other users in the room
        socket.to(room).emit('user left', { userId: userId,socketId:socket.id, room: room });
      });
  }
  
  module.exports = setupRoomHandlers;