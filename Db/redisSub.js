const Redis = require("ioredis");

const redisSub=new Redis();


// Set up subscription to code updates
redisSub.subscribe('codeUpdates', (err) => {
    if (err) {
      console.error('Failed to subscribe to codeUpdates:', err);
      return;
    }
    console.log('Subscribed to codeUpdates channel');
  });
  
  module.exports=redisSub;