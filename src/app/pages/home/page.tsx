"use client"

import TopBar from "@/app/pages/home/top-bar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import RainAnimation from "./rainAnimation";

const HomePage = () => {
  const [weather, setWeather] = useState("thunderstorm");
  const [city, setCity] = useState("London");

  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  const handleRain = () => {
    setWeather("rain")
  }

  const handleThunder = () => {
    setWeather("thunderstorm")
  }

  const handleSnow = () => {
    setWeather("snow")
  }

  let lottieOverlay = null;
  if (weather === "rain") {
    lottieOverlay = (
      <DotLottieReact src="https://lottie.host/baf07f09-62c4-403e-8459-60c72c0d3131/jaGWn45n3g.lottie" loop autoplay />
    );
  } else if (weather === "thunderstorm") {
    lottieOverlay = (
      <DotLottieReact src="https://lottie.host/306915d2-f885-4837-98a9-fca1f128412d/xxX4lakUQb.lottie" loop autoplay />
    );
  }

  // background class only, not a component
  const getBackground = (weather) => {
    switch (weather?.toLowerCase()) {
      case "clear":
        return "from-sky-300 to-yellow-200";
      case "rain":
        return "from-gray-400 to-blue-600";
      case "cloudy":
        return "from-gray-200 to-gray-400";
      case "snow":
        return "from-blue-100 to-blue-300"; // or whatever you want
      case "thunderstorm":
        return "from-gray-700 to-indigo-900";
      case "mist":
      case "fog":
        return "from-gray-300 to-gray-500";
      default:
        return "from-blue-200 to-blue-400";
    }
  };

  return (
    <div className={`min-h-screen z-[1] flex flex-col items-center text-gray-800 transition-all duration-700 bg-gradient-to-b p-4 ${getBackground(weather)}`}>
      {/* Overlay for rain or thunderstorm */}
      {(weather === "rain" || weather === "thunderstorm") && (
        <div className="fixed inset-0 z-[9999] pointer-events-none w-screen h-screen flex items-center justify-center">
          <div className="w-[100vw] h-[100vh] scale-150">
            {lottieOverlay}
          </div>
        </div>
      )}
      <div className="fixed inset-0 z-[0] pointer-events-none w-screen h-screen flex items-center justify-center">
        {/* Overlay for snow */}
      {weather === "snow" && (
        <RainAnimation />
      )}
      </div>
      
      <TopBar />
      <button className="bg-amber-300 hover:bg-amber-700 text-black font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]" onClick= {handleSnow}>Snowy snow</button>
      <button className="bg-blue-200 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]" onClick = {handleRain}>Rainy Weather</button>
      <button className = "bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]" onClick = {handleThunder}>Thundery Weather</button>
      <button className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]" onClick={handleBack}>Back to main page</button>
    </div>
  );
};

export default HomePage;
