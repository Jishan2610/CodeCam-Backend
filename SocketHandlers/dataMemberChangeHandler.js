const redisClient=require("../Db/redisConnection")
function dataMemberChangeHandler (io, socket) {
    // Code change
    socket.on('code change', async ({roomId , newCode}) => {
      console.log(roomId+" room in socket "+newCode+' code in socket')
      await redisClient.set(`room:${roomId}:code`, newCode);
        socket.to(roomId).emit('code changed', {
            code: newCode,
            senderId: socket.id,
          });
    });
    socket.on('language change', async ({roomId ,newLanguage, code}) => {
      await redisClient.set(`room:${roomId}:language`, newLanguage);
      socket.to(roomId).emit('language changed', {
          newLanguage,
          code,
          senderId: socket.id,
        });
  });
  
    
  }
  
  module.exports = dataMemberChangeHandler;