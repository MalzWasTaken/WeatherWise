import express from "express";
import { addAlerts, getAlerts,deleteAlerts } from "../controllers/alerts.js";

const router = express.Router();

router.post("/add", (req, res) => {
  addAlerts(req, res);
});

router.get("/email/:email", (req, res) => {
  getAlerts(req, res);
});

router.delete("/delete/:id", (req, res) => {
  deleteAlerts(req, res);
});

export default router;
