import db from "../db/db.js";

const getAlertsByEmail = async (email) => {
  const results = await db("alerts")
    .select("id","city","weather_type","date_to_send")
    .from("alerts")
    .where({email})
    .orderBy([{ column: "id", order: "asc" }]);

  return results;
};

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

const deleteWeatherAlert = async (id) => {
  await db("alerts").where({ id}).del();
}

export { getAlertsByEmail, addWeatherAlert,deleteWeatherAlert };
