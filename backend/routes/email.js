import express from "express";
import { sendEmail, sendCronEmail } from "../controllers/email.js";

const router = express.Router();

router.post("/", sendEmail);
router.post("/cron", sendCronEmail);

export default router;
