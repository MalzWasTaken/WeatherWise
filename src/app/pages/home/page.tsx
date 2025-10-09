"use client"

import TopBar from "@/app/pages/home/top-bar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const HomePage = () => {

  const [weather, setWeather] = useState("rain");
  const [city, setCity] = useState("London");

  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

 
  //background change based on weather
  const getBackground = (condition) => {
    switch (condition?.toLowerCase()){
      case "clear":
        return "from-sky-300 to-yellow-200";
      case "rain":
        return "from-gray-400 to-blue-600" ;
      case "cloudy":
        return "from-gray-200 to-gray-400";
      case "snow":
        return "from-blue-100 to-white";
      case "thunderstorm":
        return "from-gray-700 to-indigo-900";
      case "mist":
      case "fog":
        return "from-gray-300 to-gray-500";
      default:
        return "from-blue-200 to-blue-400";
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center  text-gray-800 transition-all duration-700 bg-gradient-to-b p-4 ${getBackground(weather)}`}>
      <TopBar />
      {/* Rain overlay */}
      {weather.toLowerCase() === "rain" && (
        <div className="h-full w-full flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/8f241ec2-b9a7-48d4-999a-0964fe33eac5/n206S1yhSM.lottie"
          loop 
          autoplay
          />
        </div>
      ) }
      <button className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-6 rounded mb-6 mt-6" onClick={handleBack}>Back to main page</button>
    </div>
  );
};

export default HomePage;
