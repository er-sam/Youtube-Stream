import redis from "redis";

const redisClient = redis.createClient();

redisClient.on("error", (err) => console.error("Redis client error", err));
redisClient.connect();

redisClient
  .ping()
  .then((result) => {
    console.log("Redis response:", result);
  })
  .catch((err) => {
    console.log("Redis-err", err);
  });
export { redisClient };
