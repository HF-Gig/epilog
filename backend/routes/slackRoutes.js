import express from "express";
import { handleSlackWebhook } from "../controllers/slackController.js";

const router = express.Router();

router.post("/webhook", handleSlackWebhook);

export default router;
