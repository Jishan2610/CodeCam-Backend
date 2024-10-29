const redisClient=require("../Db/redisConnection")
const Room=require("../Db/room");
const { Queue, Worker, QueueScheduler } = require('bullmq');

//Queue Connection
const persistQueue = new Queue('persistQueue', {
  connection: redisClient,
});
// Create a queue scheduler to manage delayed jobs
async function initializeScheduler() {
  try {
    const scheduler = new QueueScheduler('persistQueue', { connection: redisClient });
    await scheduler.waitUntilReady();
    console.log('Scheduler is ready');
  } catch (error) {
    console.error('Error initializing QueueScheduler:', error);
  }
}
initializeScheduler();
function dataMemberChangeHandler (io, socket) {
    // Code change
    socket.on('code change', async ({roomId , newCode}) => {
      try{
        //No need of direct use of redis because we are now handling this using bullMQ
        // const now = Date.now();
      // await redisClient.multi()//multi Marks the start of a transaction block. Subsequent commands will be queued for atomic execution using EXEC.
      //   .set(`code:${roomId}`, code)
      //   .set(`lastUpdate:${roomId}`, now)
      //   .publish('codeUpdates', JSON.stringify({ roomId, updateTime: now }))
      //   .exec();//Executes all previously queued commands in a transaction and restores the connection state to normal.
      
        socket.to(roomId).emit('code changed', {
          code: newCode,
          senderId: socket.id,
        });
        //Remove any scheduled jobs for that room
        await persistQueue.removeJobs(`persist-${roomId}`);

        // Schedule a new job to persist the code to MongoDB after 15 minutes
        await persistQueue.add(
          `persist-${roomId}`, // Unique job name
          { roomId,newCode },          // Data passed to the job
          { delay: 15 * 60 * 1000 } // Delay in milliseconds (15 minutes)
        );
        console.log(`Persistence scheduled for room ${roomId} in 15 minutes`);
      }catch(err){
        console.error('Error handling code update:', err);
      }
    });
    socket.on('language change', async ({roomId ,newLanguage, code}) => {
      //Remove any scheduled jobs for that room
      await persistQueue.removeJobs(`persist-${roomId}`);

      // Schedule a new job to persist the code to MongoDB after 15 minutes
      await persistQueue.add(
        `persist-${roomId}`, // Unique job name
        { roomId,newCode:code ,newLanguage},          // Data passed to the job
        { delay: 15 * 60 * 1000 } // Delay in milliseconds (15 minutes)
      );
      console.log(`Persistence scheduled for room ${roomId} in 15 minutes`);
      socket.to(roomId).emit('language changed', {
          newLanguage,
          code,
          senderId: socket.id,
        });
  });
  
    
  }
  // //redis subscriber to listen to code change and call the 
  // redisSub.on('message', async (channel, message) => {
  //   if (channel === 'codeUpdates') {
  //     const { roomId, updateTime } = JSON.parse(message);
  //     const now = Date.now();
  //     if (now - updateTime >= 15 * 60 * 1000) {
  //       await persistToMongoDB(roomId);
  //     } else {
  //       // Schedule persistence for later
  //       setTimeout(() => {
  //         persistToMongoDB(roomId);
  //       }, 15 * 60 * 1000 - (now - updateTime));
  //     }
  //   }
  // });

  // Create a worker to process jobs from the queue
const persistWorker = new Worker(
  'persistQueue',
  async (job) => {
    const { roomId,newCode,newLanguage } = job.data;
    await persistToMongoDB(roomId,newCode,newLanguage);
  },
  { connection: redisClient }
);
//function to store data in mongodb
async function persistToMongoDB(roomId,newCode,newLanguage) {
  try {
    //const code = await redisClient.get(`code:${roomId}`);
    if(!newLanguage){
      await Room.findOneAndUpdate(
        { roomId },
        { code:newCode, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
    }
    else {
      await Room.findOneAndUpdate(
        { roomId },
        { language:newLanguage,code:newCode, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
    }
    console.log(`Persisted code for room ${roomId} to MongoDB`);
  } catch (error) {
    console.error(`Error persisting code for room ${roomId}:`, error);
  }
}
  
  module.exports = dataMemberChangeHandler;