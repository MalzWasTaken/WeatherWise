import fetch from "node-fetch";

const getWeather = async (req, res) => {
  try {
    const city = req.query.city;
    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&days=7&alerts=yes`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
  }
};

export { getWeather };
