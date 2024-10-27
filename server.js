import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import { Kafka } from "kafkajs";
import helmet from "helmet";
import cors from "cors";
import dotenv from 'dotenv'
import { rateLimit } from "express-rate-limit";
import { createClient } from "redis";
import authRoute from './src/routes/authRoute.js'
import createrRoute from './src/routes/createrRoute.js'
import videoRoute from './src/routes/videoRoute.js'
import {syncViewsToDatabase } from "./src/services/Scheduler.js";

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


app.get("/", (req, res) => {
  res.send("Server running.......");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
//   logger.error(err.stack);
  res.status(500).send("Something broke!");
});

//---task-scheduled----
syncViewsToDatabase.start();

// Api-Calls
app.use('/api/v1/auth/',authRoute);
app.use('/api/v1/creater/',createrRoute)
app.use('/api/v1/video/',videoRoute)

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
