import fetch from "node-fetch";

const getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;
    
    let url;
    if (lat && lon) {
      url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&alerts=yes`;
    } else if (city) {
      url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&alerts=yes`;
    } else {
      return res.status(400).json({ error: "Either city or lat/lon coordinates are required" });
    }

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({ error: "Failed to fetch weather data" });
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