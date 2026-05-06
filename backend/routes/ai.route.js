import express from "express";
import { getMatchScore } from "../controllers/ai.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// We use 'isAuthenticated' to ensure only logged-in users use our AI quota
router.post("/match", isAuthenticated, getMatchScore);

export default router;