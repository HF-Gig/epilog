import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import wikiRoutes from "./routes/wikiRoutes.js";
import slackRoutes from "./routes/slackRoutes.js";
import notionRoutes from "./routes/notionRoutes.js";
import triggerRoutes from "./routes/triggerRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { supabase } from "./config/clients.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Epilog Backend is running smoothly",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/wiki", wikiRoutes);
app.use("/api/slack", slackRoutes);
app.use("/api/notion", notionRoutes);
app.use("/api/triggers", triggerRoutes);

// Route Fallback
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Database connectivity check
const checkDatabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from("workspaces")
      .select("id")
      .limit(1);

    if (error) {
      console.error(`[Database] Supabase connection error: ${error.message}`);
    } else {
      console.log("[Database] Supabase database connected successfully!");
    }
  } catch (err) {
    console.error(`[Database] Supabase connection failed: ${err.message}`);
  }
};

// Start listening
app.listen(PORT, () => {
  console.log(
    `[Server] Epilog Backend listening in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
  checkDatabaseConnection();
});
