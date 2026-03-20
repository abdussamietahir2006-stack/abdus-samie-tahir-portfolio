import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

// ✅ FIX: correct path resolution
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env correctly
dotenv.config({
  path: path.resolve(process.cwd(), "server", ".env")
});

// ✅ Debug
console.log("ENV PATH:", path.join(__dirname, ".env"));
console.log("ENV TEST:", process.env.MONGO_URI);

// Routes & DB
import { connectDB } from "./server/config/db";
import projectRoutes from "./server/routes/projectRoutes";
import contactRoutes from "./server/routes/contactRoutes";
import adminAuthRoutes from "./server/routes/adminAuthRoutes";
import contentRoutes from "./server/routes/contentRoutes";
import skillRoutes from "./server/routes/skillRoutes";
import uploadRoutes from "./server/routes/uploadRoutes";
import { errorHandler } from "./server/middleware/errorHandler";

async function startServer() {
  const app = express();

  // ✅ FIX: use env PORT
  const PORT = Number(process.env.PORT) || 3000;

  // ✅ Connect DB
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/projects", projectRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/admin", adminAuthRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/skills", skillRoutes);
  app.use("/api/upload", uploadRoutes);

  // Static uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Vite Dev Server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

startServer();