"use client";
import React, { useState, useRef, useEffect } from "react";
import Toast from "typescript-toastify";
import { AvatarMenu } from "../../pages/home/avatar-menu";
import { auth0 } from "../../../lib/auth0";
import { useRouter } from "next/navigation";

export default function WeatherAlertForm() {
  //User
  const [user, setUser] = useState<any>(null);

  //Form Data
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //Checking for backend
  const [checkedCity, setCheckedCity] = useState(false);
  const [currentToast, setCurrentToast] = useState(0);

  //Routing to backend/frontend
  const backendUrl = "http://localhost:5005";
  const router = useRouter();

  // Validate the city via API
  const validateCity = async (cityName: string) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/weather?city=${encodeURIComponent(cityName)}`
      );
      if (!res.ok) {
        setMessage(`Invalid City: ${cityName}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating city:", err);
      setMessage("Error checking city. Try again later.");
      return false;
    }
  };

  //When user presses submit
  const handleSubmit = async () => {
    if (!weather || !city) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setLoading(true);

    //Validate city
    let validCity = checkedCity;
    if (!checkedCity) {
      validCity = await validateCity(city);
      setCheckedCity(validCity);
    }

    if (!validCity) {
      setLoading(false);
      return;
    }

    //See if there is already an alert for user
    const res = await fetch(
      `${backendUrl}/api/alerts/email/${encodeURIComponent(user.email)}`
    );

    if (res.ok) {
      const alerts = await res.json();
      const exists = alerts.find(
        (alert: any) => alert.city === city && alert.weather_type === weather
      );
      if (exists) {
        setMessage("An Alert Has Already Been Set For This!");
        setLoading(false);
        return;
      }
      console.log("No alert found - fetching weather");
    } else {
      console.log("Failed to fetch alerts");
      setMessage("Error Fetching Alerts");
      setLoading(false);
      return;
    }

    // Fetch weather and detect matching day
    try {
      const res = await fetch(
        `${backendUrl}/api/weather?city=${encodeURIComponent(city)}`
      );
      const data = await res.json();

      let dateToSend: string | null = null;

      if (data.forecast && Array.isArray(data.forecast.forecastday)) {
        const forecastDays = data.forecast.forecastday;
        console.log(forecastDays);

        const today = new Date().toISOString().split("T")[0];

        // Find first matching day (not including today)
        const matchingDay = forecastDays.find((day:any) => {
          const condition = day.day.condition.text.toLowerCase();
          const forecastDate = day.date;
          if (forecastDate !== today && condition.includes(weather.toLowerCase())) {
            console.log('Found matching day:', forecastDate);
          } else {
            console.log('No match for day:', forecastDate, 'with condition:', condition);
          }
          return (
            forecastDate !== today && condition.includes(weather.toLowerCase())
          );
        });

        if (matchingDay) {
          const weatherDate = new Date(matchingDay.date);
          weatherDate.setDate(weatherDate.getDate() - 1);

          //Change to SQL format
          dateToSend = weatherDate.toISOString().split("T")[0];
        }
      }

      await fetch(`${backendUrl}/api/alerts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          city: city,
          weather_type: weather,
          date_to_send: dateToSend,
        }),
      });

      // Success submission
      if (currentToast <= 0) {
        setCurrentToast(1);
        new Toast({
          toastMsg: `Alert saved for Weather (${weather}) in ${city}.`,
          autoCloseTime: 6000,
          theme: "dark",
          type: "success",
          onClose: () => setCurrentToast(0),
        });
      }

      setMessage("You Will Be Notified Via Email!");
    } catch (err) {
      console.error("Error fetching weather or adding alert:", err);
      setMessage("Something went wrong while saving your alert.");
    }

    // Reset form after done
    setTimeout(() => {
      setMessage("");
      setCity("");
      setWeather("");
      setCheckedCity(false);
      setLoading(false);
    }, 5000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This handles Auth0 redirect after login
        if (
          window.location.search.includes("code=") ||
          window.location.search.includes("error=")
        ) {
          await auth0.handleRedirectCallback();
          window.history.replaceState({}, document.title, "/"); // clean URL
        }

        const userProfile = await auth0.getUser();

        //Redirect if not logged in
        if (!userProfile) {
          router.replace("../");
        }
        setUser(userProfile);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-400 to-blue-600">
      <div className="absolute top-4 right-4">
        <AvatarMenu />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-black mb-4">
          Set Weather Alert ☀️
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
          className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            loading
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
    </div>
  );
}
