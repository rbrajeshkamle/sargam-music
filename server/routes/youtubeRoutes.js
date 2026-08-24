import express from "express";
import { searchYoutube } from "../controllers/youtubeController.js";

const router = express.Router();

// SEARCH YOUTUBE VIDEOS
router.get("/search", searchYoutube);

export default router;