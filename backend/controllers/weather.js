import fetch from "node-fetch";

const getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    // Search City first
    const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!Array.isArray(searchData) || searchData.length === 0) {
      return res
        .status(404)
        .json({ error: `City '${city}' not found (possible typo?)` });
    }

    // Find an exact match by name (case-insensitive)
    const exactMatch = searchData.find(
      (item) => item.name.toLowerCase() === city.toLowerCase()
    );

    const matchedCity = exactMatch || searchData[0]; // fallback to first if no exact match

    // Fetch forecast for that city
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      matchedCity.name
    )}&days=7&alerts=yes`;

    const forecastRes = await fetch(forecastUrl);
    const data = await forecastRes.json();

    if (data.error) {
      return res.status(404).json({ error: data.error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchCities = async (req, res) => {
  try {
    const query = req.query.q;
    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    const formattedData = data.map((city) => ({
      name: city.name,
      region: city.region,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Weather search API error:", err);
    res.status(500).json({ error: "Failed to search cities" });
  }
};

export { getWeather, searchCities };
