import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import UserRouter from "./routes/users.js";
import WeatherRouter from "./routes/weather.js";
import EmailRouter from "./routes/email.js"
import AlertRouter from "./routes/alerts.js"

import "./cron/alerts.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/users", UserRouter);
app.use("/api/weather", WeatherRouter);
app.use("/api/email", EmailRouter);
app.use("/api/alerts", AlertRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
