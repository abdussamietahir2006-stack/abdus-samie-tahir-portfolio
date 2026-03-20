import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";
import { connectDB } from "./db";

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ MongoDB URI
const MONGO_URI = process.env.MONGO_URI as string;

// ✅ Global cache (VERY IMPORTANT for Vercel)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// ✅ Connect DB function
async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("MongoDB connected ✅");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Test Route
app.get("/api/test", async (req, res) => {
  try {
    await connectDB();
    res.json({ message: "Backend + DB working ✅" });
  } catch (error) {
    res.status(500).json({ error: "DB connection failed ❌" });
  }
});

// 👉 Example API route
app.get("/api/hello", async (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});

// ❌ NO app.listen()

// ✅ Export for Vercel
export default serverless(app);