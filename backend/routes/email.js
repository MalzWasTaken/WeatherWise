import express from "express";
<<<<<<< Updated upstream
import { sendEmail, sendCronEmail } from "../controllers/email.js";

const router = express.Router();

router.post("/", sendEmail);
router.post("/cron", sendCronEmail);
=======
import { sendMail } from "../controllers/email.js";

const router = express.Router();

router.post("/", sendMail);
>>>>>>> Stashed changes

export default router;
