import cron from "node-cron";
import { redisClient } from "./redis-Services.js";
import { Video } from "../models/Video.js";

let isSyncing = false;
// Schedule the cron job to run every 5 seconds
export const syncViewsToDatabase = cron.schedule("*/51 * * * * *", async () => {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const keys = await redisClient.keys("video_views:*");
    for (const key of keys) {
      const videoId = key.split(":")[1];
      const ViewCount = await redisClient.get(key);
      await Video.findByIdAndUpdate(videoId, {
        $inc: { views: parseInt(ViewCount, 10) },
      });
      await redisClient.del(key);
    }
    console.log("Views synchronized with the database");
  } catch (error) {
    console.error("Error syncing views:", error);
  }
  finally{
    isSyncing = false
  }
});



// Schedule the cron job to run every 5 seconds
export const syncLikesToDatabase = cron.schedule("*/51 * * * * *", async () => {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const keys = await redisClient.keys("video_like:*");
    for (const key of keys) {
      const videoId = key.split(":")[1];
      const LikeCount = await redisClient.get(key);
      await Video.findByIdAndUpdate(videoId, {
        $inc: { like: parseInt(LikeCount, 10) },
      });
      await redisClient.del(key);
    }
    console.log("Like synchronized with the database");
  } catch (error) {
    console.error("Error syncing likes:", error);
  }
  finally{
    isSyncing = false
  }
});



// module.exports = syncLikesToDatabase;

// import cron from 'node-cron'
// const { Video } = require('../models/Video');

// //scheduled-for-every-five-seconds
// cron.schedule('*/5 * * * * *', async () => {
//   try {
//     // Get all keys that match the "video_likes:*" pattern
//     const keys = await redisClient.keys('video_likes:*');

//     for (const key of keys) {
//       const videoId = key.split(':')[1];
//       const likeCount = await redisClient.get(key);

//       await Video.findByIdAndUpdate(videoId, { $inc: { like: parseInt(likeCount, 10) } });

//       // Reset the like count in Redis
//       await redisClient.del(key);
//     }
//   } catch (error) {
//     console.error('Error syncing likes to MongoDB:', error);
//   }
// });
