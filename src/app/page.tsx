"use client";
import { useState, useRef } from "react";
import useSound from "use-sound";
import { useAppRouter } from "./router/router";

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flashStage, setFlashStage] = useState<null | 'white' | 'image' | 'fadeout'>(null);
  const [imageOpacity, setImageOpacity] = useState(0);
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);

  const { goToLogin, goToRegister, goToDashboard } = useAppRouter();

  const audio = new Audio('/sounds/gaddamn.mp3');

  const handleFlashbang = () => {
    audio.play();
    setFlashStage('white');
    setImageOpacity(0);
    setTimeout(() => {
      setFlashStage('image');
      setTimeout(() => setImageOpacity(1), 50);
      fadeTimeout.current = setTimeout(() => {
        setImageOpacity(0);
        setTimeout(() => setFlashStage(null), 700);
      }, 1400);
    }, 2000);
  };

  const getWeather = () => {
    setLoading(true);
    setError("");
    setWeather(null);
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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {flashStage === 'white' && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-300" style={{ opacity: 1 }} />
      )}
      {flashStage === 'image' && (
        <div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          style={{ background: `black`, transition: 'background 0.7s' }}
        >
          <img
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c9a27e0a-52f7-4cec-a932-b6246308a58e/dfrux2e-65634c86-4516-480c-a9ec-d669aa794fd1.jpg/v1/fit/w_828,h_1018,q_70,strp/staring_donkey_by_j0j0999ozman_dfrux2e-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTU4NiIsInBhdGgiOiIvZi9jOWEyN2UwYS01MmY3LTRjZWMtYTkzMi1iNjI0NjMwOGE1OGUvZGZydXgyZS02NTYzNGM4Ni00NTE2LTQ4MGMtYTllYy1kNjY5YWE3OTRmZDEuanBnIiwid2lkdGgiOiI8PTEyOTAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.rsif7fpzkLTpz9PbA6EcSihOhZszBw00GkU1087iMRw"
            alt="Staring Donkey"
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              width: 'auto',
              height: 'auto',
              opacity: imageOpacity,
              transition: 'opacity 0.7s',
              borderRadius: 0,
              boxShadow: 'none',
            }}
          />
        </div>
      )}
      <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">WeatherWise</h1>
      <p className="text-gray-700 text-center mb-8 max-w-md">
        Your intuitive weather companion. Get real-time updates and forecasts wherever you are.
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

      <button onClick={goToLogin} className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-6 rounded mb-6">Login</button>
      <button onClick={goToRegister} className="bg-yellow-500 hover:bg-yellow-300 text-black font-bold py-2 px-6 rounded mb-6">Register</button>
      <button onClick={goToDashboard} className="bg-green-500 hover:opacity-75 text-black font-bold py-2 px-6 rounded mb-6">Dashboard</button>
      <button onClick={handleFlashbang} className="bg-black hover:opacity-75 text-white font-bold py-2 px-6 rounded mb-6">Flashbang</button>
    </div>
  );
}
