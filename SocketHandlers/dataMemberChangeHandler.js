function dataMemberChangeHandler(io, socket) {
    // Code change
    socket.on('code change', ({roomId , newCode}) => {
      console.log(roomId+" room in socket "+newCode+' code in socket')
        socket.to(roomId).emit('code changed', {
            code: newCode,
            senderId: socket.id,
          });
    });
    socket.on('language change', ({roomId ,newLanguage, code}) => {
      socket.to(roomId).emit('language changed', {
          newLanguage,
          code,
          senderId: socket.id,
        });
  });
  
    
  }
  
  module.exports = dataMemberChangeHandler;