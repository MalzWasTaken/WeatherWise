"use client";
import React, { useState, useEffect } from "react";
import Toast from "typescript-toastify";
import { AvatarMenu } from "../../pages/home/avatar-menu";
import { auth0 } from "../../../lib/auth0";
import { useRouter } from "next/navigation";

export default function WeatherAlertForm() {
  const [user, setUser] = useState<any>(null);
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingCity, setValidatingCity] = useState(false);
  const [checkedCity, setCheckedCity] = useState(false);

  const [userAlerts, setUserAlerts] = useState<any[]>([]);

  const backendUrl = "http://localhost:5005";
  const router = useRouter();

  // Fetch user alerts
  const fetchUserAlerts = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `${backendUrl}/api/alerts/email/${encodeURIComponent(user.email)}`
      );
      if (res.ok) {
        const alerts = await res.json();
        const alertDetails = alerts.map((alert: any) => ({
          id: alert.id,
          city: alert.city,
        }));
        setUserAlerts(alertDetails);
      } else {
        setUserAlerts([]);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setUserAlerts([]);
    }
  };

  // Validate city
  const validateCity = async (cityName: string) => {
    setValidatingCity(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/weather?city=${encodeURIComponent(cityName)}`
      );

      // If city is invalid
      if (!res.ok) {
        setMessage(`Invalid City: ${cityName}`);
        setValidatingCity(false);
        return false;
      }

      // City is valid
      setMessage(""); 
      setValidatingCity(false);
      return true;

    } catch (err) {
      console.error("Error validating city:", err);
      setMessage("Error checking city. Try again later.");
      setValidatingCity(false);
      return false;
    }
  };

  // Handle adding alert
  const handleSubmit = async () => {
    if (!weather || !city) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setLoading(true);

    // Validate city if not already validated
    let validCity = checkedCity;
    if (!checkedCity) {
      validCity = await validateCity(city);
      setCheckedCity(validCity);
    }

    if (!validCity) {
      setLoading(false);
      return;
    }

    // Check for duplicate
    const exists = userAlerts.find(
      (alert) =>
        alert.city.toLowerCase() === city.toLowerCase() &&
        alert.weather_type.toLowerCase() === weather.toLowerCase()
    );
    if (exists) {
      setMessage("An Alert Has Already Been Set For This!");
      setLoading(false);
      return;
    }

    // Fetch weather forecast to determine date_to_send
    try {
      const weatherRes = await fetch(
        `${backendUrl}/api/weather?city=${encodeURIComponent(city)}`
      );
      const data = await weatherRes.json();

      let dateToSend: string | null = null;
      if (data.forecast && Array.isArray(data.forecast.forecastday)) {
        const forecastDays = data.forecast.forecastday;
        const today = new Date().toISOString().split("T")[0];

        const matchingDay = forecastDays.find((day: any) => {
          const condition = day.day.condition.text.toLowerCase();
          return (
            day.date !== today && condition.includes(weather.toLowerCase())
          );
        });

        if (matchingDay) {
          const weatherDate = new Date(matchingDay.date);
          weatherDate.setDate(weatherDate.getDate() - 1);
          dateToSend = weatherDate.toISOString().split("T")[0];
        }
      }

      // Save alert to db
      await fetch(`${backendUrl}/api/alerts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          city,
          weather_type: weather,
          date_to_send: dateToSend,
        }),
      });

      new Toast({
        toastMsg: `Alert saved for Weather (${weather}) in ${city}.`,
        autoCloseTime: 6000,
        theme: "dark",
        type: "success",
      });

      setCity("");
      setWeather("");
      setCheckedCity(false);

      fetchUserAlerts();
    } catch (err) {
      console.error("Error saving alert:", err);
      setMessage("Something went wrong while saving your alert.");
    }

    setLoading(false);
  };

  // Handle deleting an alert
  const handleDelete = async (alertId: any) => {
    try {
      console.log("Deleting alert with ID:", alertId);
      const res = await fetch(
        `${backendUrl}/api/alerts/delete/${encodeURIComponent(alertId)}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        new Toast({
          toastMsg: "Alert deleted successfully.",
          autoCloseTime: 4000,
          theme: "dark",
          type: "success",
        });
        fetchUserAlerts();
      }
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (
          window.location.search.includes("code=") ||
          window.location.search.includes("error=")
        ) {
          await auth0.handleRedirectCallback();
          window.history.replaceState({}, document.title, "/");
        }

        const userProfile = await auth0.getUser();
        if (!userProfile) router.replace("../");
        setUser(userProfile);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.email) fetchUserAlerts();
  }, [user]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-400 to-blue-600 p-4">
      <div className="absolute top-4 right-4">
        <AvatarMenu />
      </div>

      {/* Alert Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center mb-6">
        <h2 className="text-2xl font-bold text-black mb-4">
          Set Weather Alert
        </h2>

        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Weather Type</option>
          <option value="Rain">🌧️ Rain</option>
          <option value="Sunny">☀️ Sunny</option>
          <option value="Snow">❄️ Snow</option>
          <option value="Cloudy">☁️ Cloudy</option>
          <option value="Storm">🌩️ Thunder</option>
          <option value="Fog">🌫️ Fog</option>
        </select>

        <input
          type="text"
          placeholder="Enter Your City"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setCheckedCity(false);
          }}
          onBlur={() => validateCity(city)} // validate on blur
          className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {validatingCity && (
          <p className="text-sm text-gray-500 mb-2">Checking city...</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || validatingCity}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            loading || validatingCity
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Setting Alert..." : "Set Alert"}
        </button>

        {message && (
          <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>

      {/* User Alerts */}
      {userAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Your Alerts</h3>
          <ul className="space-y-2">
            {userAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex justify-between items-center border-b border-gray-200 pb-1"
              >
                <span>
                  {alert.weather_type} in {alert.city}{" "}
                  {alert.date_to_send ? `(Send: ${alert.date_to_send})` : ""}
                </span>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
