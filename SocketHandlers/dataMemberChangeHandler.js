function dataMemberChangeHandler(io, socket) {
    // Code change
    socket.on('code change', ({room , code}) => {
        socket.to(room).emit('code change', {
            code: code,
            senderId: socket.id,
          });
    });
  
    
  }
  
  module.exports = dataMemberChangeHandler;