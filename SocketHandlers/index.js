const setupRoomHandlers =require("./roomHandler")
function setupSocketIO(io) {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      setupRoomHandlers(io, socket);
      
  
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
  
  module.exports = setupSocketIO;