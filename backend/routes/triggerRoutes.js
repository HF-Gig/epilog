import express from "express";
import {
  getTriggers,
  addTrigger,
  removeTrigger,
} from "../controllers/triggerController.js";

const router = express.Router();

router.get("/", getTriggers);
router.post("/", addTrigger);
router.delete("/", removeTrigger);

export default router;
