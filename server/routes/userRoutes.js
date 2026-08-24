import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET USER PROFILE

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;