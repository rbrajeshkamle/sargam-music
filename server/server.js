import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());

app.use(morgan("dev"));

/* =========================
   TEST ROUTES
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎵 SARGAM API is running",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API connection successful",
  });
});

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/youtube", youtubeRoutes);

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 2100;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SARGAM Server running on port ${PORT}`);
});