import express from "express";
import { syncWiki, getWikiHistory, deleteWiki } from "../controllers/wikiController.js";

const router = express.Router();

router.post("/sync", syncWiki);
router.get("/history", getWikiHistory);
router.delete("/:id", deleteWiki);

export default router;
