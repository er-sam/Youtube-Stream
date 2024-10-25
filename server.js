import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import { Kafka } from "kafkajs";
import helmet from "helmet";
import cors from "cors";
import dotenv from 'dotenv'
import { rateLimit } from "express-rate-limit";
// import logger from "./logs/logger.js";
import { createClient } from "redis";
import authRoute from './src/routes/authRoute.js'


const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
dotenv.config()
app.use(express.json({ limit: "1024kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Redis Connection
const redis = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

redis
  .ping()
  .then((result) => {
    // logger.info("Redis connected");
    console.log("Redis ping response:", result);
  })
  .catch((error) => {
    // logger.error("kafka-error::::",error);
    console.error("Redis-error:", error);
  });

// Kafka Setup with Fallback and Error Handling
// const kafka = new Kafka({
//   brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
// });
// const producer = kafka.producer();

// const initKafka = async () => {
//   try {
//     await producer.connect();
//     console.log("kafka","kafka connecvted...")
//     // logger.info("Kafka connected"); // Log success message
//   } catch (error) {
//     console.log("kafka",error)
//     // logger.error("Kafka connection error:", error); // Log error with descriptive message
//   }
// };

// initKafka().catch((err) => logger.error("Kafka initialization error:", err));

// Routes setup
app.get("/", (req, res) => {
  res.send("Server running.......");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
//   logger.error(err.stack);
  res.status(500).send("Something broke!");
});



// Api-Calls
app.use('api/v1/auth/',authRoute);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
