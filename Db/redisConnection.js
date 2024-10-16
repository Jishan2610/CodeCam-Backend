const Redis = require("ioredis");

const redisClient = new Redis();  // Initialize Redis connection

// Handle Redis connection success
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

// Handle Redis connection error
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Optional: Handle Redis disconnection
redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Optional: Gracefully handle application shutdown
const gracefulShutdown = () => {
  redisClient.quit(() => {
    console.log("Redis client disconnected through app termination");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);  // Handle CTRL+C shutdown
process.on("SIGTERM", gracefulShutdown);  // Handle termination

module.exports = redisClient;  // Export the Redis client