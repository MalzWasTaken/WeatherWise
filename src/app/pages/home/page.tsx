"use client"

import TopBar from "@/app/pages/home/top-bar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const RainAnimation = dynamic(()=> import ("./rainAnimation"), {ssr:false});
const GoodRainAnimation = dynamic(() => import ("./GoodRainAnimation"),{ssr:false});

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



  // background class only, not a component
  const getBackground = (weather:string):string => {
    switch (weather?.toLowerCase()) {
      case "clear":
        return "from-sky-300 to-yellow-200";
      case "rain":
        return "from-gray-500 to-gray-600";
      case "cloudy":
        return "from-gray-200 to-gray-400";
      case "snow":
        return "from-gray-400 to-gray-400";
      case "thunderstorm":
        return "from-gray-700 to-gray-900";
      case "mist":
      case "fog":
        return "from-gray-300 to-gray-500";
      default:
        return "from-blue-200 to-blue-400";
    }
  };

  return (
    <div className={`min-h-screen z-[1] flex flex-col items-center text-gray-800 transition-all duration-700 bg-gradient-to-b p-4 ${getBackground(weather)}`}>
       <div className="fixed inset-0 z-[0] pointer-events-none w-screen h-screen flex items-center justify-center">
      {/* Overlay for rain */}
      {weather === "rain" && (
        <GoodRainAnimation type ="rain"/>
      )}

      {/* Overlay for thunderstorm */}
      {weather === "thunderstorm" && (
        <GoodRainAnimation type="thunderstorm"/>
      )}
     
        {/* Overlay for snow */}
      {weather === "snow" && (
        <RainAnimation type="drizzle"/>
      )}
      </div>
      
      <TopBar />
      <button className={`${weather === "snow" ? "bg-green-400 hover:bg-green-300 text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2] " : "bg-black text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]  "}`} onClick= {handleSnow}>Snowy snow</button>
      <button className={`${weather === "rain" ? "bg-green-400 hover:bg-green-300 text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2] " : "bg-black text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]  "}`} onClick = {handleRain}>Rainy Weather</button>
      <button className = {`${weather === "thunderstorm" ? "bg-green-400 hover:bg-green-300 text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2] " : "bg-black text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]  "}`}onClick = {handleThunder}>Thundery Weather</button>
      <button className="bg-black text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]" onClick={handleBack}>Back to main page</button>
    </div>
  );
};

export default HomePage;
