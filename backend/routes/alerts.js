import express from "express";
import { addAlerts, getAlerts } from "../controllers/alerts.js";

const router = express.Router();

router.post("/add", (req, res) => {
  addAlerts(req, res);
});

router.get("/email/:email", (req, res) => {
  getAlerts(req, res);
});

export default router;
