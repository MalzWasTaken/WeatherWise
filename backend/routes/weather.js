<<<<<<< Updated upstream
import {getWeather, searchCities} from "../controllers/weather.js";
=======
import {getWeather} from "../controllers/weather.js";
>>>>>>> Stashed changes
import express from "express";

const router = express.Router();

router.get("/", getWeather)
<<<<<<< Updated upstream
router.get("/search", searchCities)
=======
>>>>>>> Stashed changes

export default router