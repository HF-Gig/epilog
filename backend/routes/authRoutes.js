import express from "express";
import { registerUser, loginUser, verifyUserToken } from "../controllers/authController.js";
import { redirectToNotionAuth, handleNotionCallback } from "../controllers/notionAuthController.js";
import { redirectToSlackAuth, handleSlackCallback } from "../controllers/slackAuthController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/verify-token", verifyUserToken);
router.get("/slack", redirectToSlackAuth);
router.get("/callback/slack", handleSlackCallback);

// Notion OAuth Routes
router.get("/notion", redirectToNotionAuth);
router.get("/callback/notion", handleNotionCallback);

export default router;
