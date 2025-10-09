"use client";
import  { useRouter } from "next/navigation"
import { useState } from "react";

export default function Home() {
  // State for weather data
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  //navigation handlers for testing

  const handleHome = () => {
    router.push("./pages/home")
  }

  const handleLogin = () => {
      router.push("./pages/Login")
  }

  const handleRegister = () => {
    router.push("./pages/Register")
  }

  // Placeholder function for fetching weather (API to be added later)
  const getWeather = () => {
    setLoading(true);
    setError("");
    setWeather(null);

    // TODO: Replace with Axios call to OpenWeather API
    setTimeout(() => {
      setWeather({
        city: "London",
        temperature: 18,
        description: "Partly cloudy",
        icon: "🌤️",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
        WeatherWise
      </h1>
      <p className="text-gray-700 text-center mb-8 max-w-md">
        Your intuitive weather companion. Get real-time updates and forecasts
        wherever you are.
      </p>

      <button
        onClick={getWeather}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mb-6"
      >
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {weather && (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-2">{weather.city}</h2>
          <p className="text-xl mb-2">{weather.temperature}°C</p>
          <p className="mb-2">{weather.description}</p>
          <p className="text-4xl">{weather.icon}</p>
        </div>
      )}

      <button onClick={handleHome} className=" bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-6 rounded mb-6 mt-6"> Home </button>
      <button onClick={handleLogin} className=" bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-6 rounded mb-6"> Login </button>
      <button onClick={handleRegister} className= " bg-orange-200 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded mb-6"> Register </button>
    </div>
  );
}
