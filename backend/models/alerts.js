import db from "../db/db.js";

// Get all weather alerts for a specific email
const getAlertsByEmail = async (email) => {
  const results = await db("alerts")
    .select("city","weather_type","date_to_send")
    .from("alerts")
    .where({email})
    .orderBy([{ column: "id", order: "asc" }]);

  return results;
};

// Add a new weather alert
const addWeatherAlert = async (data) => {
  const { email, city, weather_type,date_to_send } = data;
  const [newAlert] = await db("alerts")
    .insert({
      email: email,
      city,
      weather_type,
      date_to_send,
    })
    .returning("*");
  return newAlert;
};

export { getAlertsByEmail, addWeatherAlert };
