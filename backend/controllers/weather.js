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

const searchCities = async (req, res) => {
  try {
    const query = req.query.q;
    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();
    
    const formattedData = data.map(city => ({
      name: city.name,
      region: city.region,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    }));
    
    res.json(formattedData);
  } catch (err) {
    console.error("Weather search API error:", err);
    res.status(500).json({ error: "Failed to search cities" });
  }
};
 
export {getWeather, searchCities}