import cron from "node-cron";
import db from "../db/db.js";
import { sendCronEmail } from "../controllers/email.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

console.log("Cron job file loaded");

cron.schedule("0 0 * * *", async () => {
  console.log("Running weather alert check...");

  try {
    const today = new Date().toISOString().split("T")[0];

    const alerts = await db("alerts")
      .where("date_to_send", today)
      .andWhere("sent", false);

    for (const alert of alerts) {
      console.log(
        `Sending alert to ${alert.email} about ${alert.weather_type} in ${alert.city}`
      );

      await sendCronEmail({
        to: alert.email,
        from: `"WeatherWise Team" <${process.env.EMAIL_USER}>`,
        subject: `Weather Alert for ${alert.weather_type} in ${alert.city}`,
        html: `<p>Reminder: there will be ${alert.weather_type} tomorrow in ${alert.city}.</p>`,
      });

      await db("alerts").where("id", alert.id).update({ sent: true });

      let newDateToSend = null;

      try {
        const weatherRes = await fetch(
          `http://localhost:5005/api/weather?city=${encodeURIComponent(
            alert.city
          )}`
        );
        const data = await weatherRes.json();

        if (data.forecast && Array.isArray(data.forecast.forecastday)) {
          const forecastDays = data.forecast.forecastday;
            const todayDate = new Date().toISOString().split("T")[0];
            console.log("Today's date:", todayDate);
          const matchingDay = forecastDays.find(
            (day) =>
              day.date !== todayDate &&
              day.day.condition.text
                .toLowerCase()
                .includes(alert.weather_type.toLowerCase())
          );

          if (matchingDay) {
            const weatherDate = new Date(matchingDay.date);
            weatherDate.setDate(weatherDate.getDate() - 1);
              newDateToSend = weatherDate.toISOString().split("T")[0];
              console.log("Next alert date found:", newDateToSend);
          }
        }

        await db("alerts")
          .where("id", alert.id)
          .update({ date_to_send: newDateToSend, sent: false });
      } catch (err) {
        console.error("Error fetching weather for next alert date:", err);
      }

    }
  } catch (err) {
    console.error("Error running cron job:", err);
  }
});
