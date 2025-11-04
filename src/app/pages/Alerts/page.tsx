"use client";
import React, { useState } from "react";
import Toast from "typescript-toastify";
import { AvatarMenu } from "../../pages/home/avatar-menu";

const WeatherAlertForm: React.FC = () => {
  const [weather, setweather] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");

  const backendUrl = "http://localhost:5005";

  const handleSubmit = async () => {
    //Make sure user fills in details
    if (!weather || !city) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    //Success messages
    setLoading(false);
    setMessage("You Will Be Notified Via Email!");

    new Toast({
      toastMsg: "Saved Alert For Weather " + weather + " in " + city,
      autoCloseTime: 5000,
      theme: "dark",
      type: "success",
    });

    //Reset fields when done
    setTimeout(() => {
      setMessage("");
      setCity("");
      setweather("");
    }, 8000);
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-400 to-blue-600">
        <div className="absolute top-4 right-4">
          <AvatarMenu />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold text-black mb-4">
            Set Weather Alert
          </h2>

          {/* Options for weather */}
          <select
            value={weather}
            onChange={(e) => setweather(e.target.value)}
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

          {/* Country input */}
          <input
            type="text"
            placeholder="Enter City or Country"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Submit button */}
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
    </>
  );
};

export default WeatherAlertForm;
