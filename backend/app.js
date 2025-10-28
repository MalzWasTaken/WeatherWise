import express from "express";
import path from "path";
import UserRouter from "./routes/users.js";
import cors from "cors";

const __dirname = path.resolve();
const app = express();
const PORT = 5005;

app.use(express.json());
app.use(cors());

app.use("/api/users", UserRouter);

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
