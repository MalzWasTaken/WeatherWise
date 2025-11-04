import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: ".env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (req, res) => {
  const { to, subject,html} = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"WeatherWise Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "image.png",
          path: path.join(__dirname, "../images/image.png"),
          cid: "welcome_image",
        },
      ],
    });

    console.log(" Email sent:", info.messageId);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};

export { sendMail };
