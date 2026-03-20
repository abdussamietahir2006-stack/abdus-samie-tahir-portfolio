import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { connectDB } from "./db";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", async (req, res) => {
  try {
    await connectDB();
    res.json({ message: "Backend + DB working ✅" });
  } catch (error) {
    res.status(500).json({ error: "DB connection failed ❌" });
  }
});

// Example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});

// Export
export default serverless(app);