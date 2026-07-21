import express from "express";
import {
  saveNotionConfig,
  getNotionConfig,
  deleteNotionConfig,
  testNotionConfig,
} from "../controllers/notionConfigController.js";

const router = express.Router();

// Save or update Notion credentials for a workspace
router.post("/config", saveNotionConfig);

// Get Notion config status for a workspace (API key masked)
router.get("/config", getNotionConfig);

// Remove Notion config for a workspace
router.delete("/config", deleteNotionConfig);

// Test if provided credentials are valid
router.post("/test", testNotionConfig);

export default router;
