"use client";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function Home() {
  // State for weather data
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flashStage, setFlashStage] = useState<null | 'white' | 'image' | 'fadeout'>(null);
  const router = useRouter();

  const handleLogin = () => {
    router.push("./pages/Login");
  };

  const handleRegister = () => {
    router.push("./pages/Register");
  };

  const handleDashboard = () => {
    router.push("./pages/home");
  };

  const handleFlashbang = () => {
    setFlashStage('white');
    setTimeout(() => setFlashStage('image'), 400); // white flash for 400ms
    setTimeout(() => setFlashStage('fadeout'), 1800); // image for 1.4s
    setTimeout(() => setFlashStage(null), 2500); // fade out for 0.7s
  };

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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Flashbang/image overlay */}
      {flashStage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${flashStage === 'white' ? 'bg-white opacity-100' : ''}`}
          style={{
            background: flashStage === 'image' || flashStage === 'fadeout'
              ? `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c9a27e0a-52f7-4cec-a932-b6246308a58e/dfrux2e-65634c86-4516-480c-a9ec-d669aa794fd1.jpg/v1/fit/w_828,h_1018,q_70,strp/staring_donkey_by_j0j0999ozman_dfrux2e-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTU4NiIsInBhdGgiOiIvZi9jOWEyN2UwYS01MmY3LTRjZWMtYTkzMi1iNjI0NjMwOGE1OGUvZGZydXgyZS02NTYzNGM4Ni00NTE2LTQ4MGMtYTllYy1kNjY5YWE3OTRmZDEuanBnIiwid2lkdGgiOiI8PTEyOTAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.rsif7fpzkLTpz9PbA6EcSihOhZszBw00GkU1087iMRw') center center / cover no-repeat`
              : flashStage === 'white'
                ? undefined
                : undefined,
            opacity: flashStage === 'fadeout' ? 0 : 1,
            transition: 'background 0.7s, opacity 0.7s',
          }}
        />
      )}
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

      <button onClick={handleLogin} className=" bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-6 rounded mb-6"> Login </button>
      <button onClick={handleRegister} className= " bg-yellow-500 hover:bg-yellow-300 text-black font-bold py-2 px-6 rounded mb-6"> Register </button>
      <button onClick={handleDashboard} className = "bg-green-500 text-black font-bold py-2 px-6 rounded mb-6"> Dashboard</button>
      <button onClick={handleFlashbang} className = "bg-black text-white font-bold py-2 px-6 rounded mb-6">Local Girl in your neighborhood</button>
      <style jsx global>{`
        /* No extra keyframes needed, handled by React state and transition classes */
      `}</style>
    </div>
  );
}
