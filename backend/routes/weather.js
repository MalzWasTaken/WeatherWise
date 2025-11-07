import {getWeather, searchCities} from "../controllers/weather.js";
import express from "express";

const router = express.Router();

router.get("/", getWeather)
router.get("/search", searchCities)

export default router