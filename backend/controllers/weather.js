import fetch from "node-fetch";

 const getWeather = async (req, res) => {
   try {
     const city = req.query.city;
     const API_KEY = process.env.WEATHER_API_KEY;
     const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
       city
     )}`;

     const response = await fetch(url);
     const data = await response.json();
     res.json(data);
   } catch (err) {
     console.error("Weather API error:", err);
   }
};
 
export {getWeather}