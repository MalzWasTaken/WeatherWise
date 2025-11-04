import {getWeather} from "../controllers/weather.js";
import express from "express";

const router = express.Router();

router.get("/", getWeather)

export default router