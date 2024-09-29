function setupRoomHandlers(io, socket) {
    socket.on('join room', ({room , userId}) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
      socket.emit('room joined', room);
    });
  
    // Add more room-related event handlers here
  }
  
  module.exports = setupRoomHandlers;