"use client";

import TopBar from "./top-bar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { auth0 } from "../../../lib/auth0";
import { useGeolocation } from "@uidotdev/usehooks";
import Toast from "typescript-toastify";
import { ForecastCard } from "./ForecastCard";
import { TemperatureCard } from "./TemperatureCard";
import { WeatherDetailsCard } from "./WeatherDetailsCard";

const RainAnimation = dynamic(() => import("./rainAnimation"), { ssr: false });
const GoodRainAnimation = dynamic(() => import("./GoodRainAnimation"), {
  ssr: false,
});

const backendUrl = "http://localhost:5005";

const HomePageWrapper = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (
          window.location.search.includes("code=") ||
          window.location.search.includes("error=")
        ) {
          await auth0.handleRedirectCallback();
        }

        const isAuthenticated = await auth0.isAuthenticated();
        if (!isAuthenticated) {
          await auth0.logout({
            logoutParams: { returnTo: window.location.origin },
          });
        }

        const userProfile = await auth0.getUser();
        setUser(userProfile);

        if (userProfile?.email) {
          const response = await fetch(
            `${backendUrl}/api/users/email/${encodeURIComponent(
              userProfile.email
            )}`
          );

          let existingUser = null;
          if (response.ok) {
            const text = await response.text();
            existingUser = text ? JSON.parse(text) : null;
          }

          if (existingUser) {
            console.log("Existing user found:", existingUser);
            const updateResponse = await fetch(
              `${backendUrl}/api/users/update/${encodeURIComponent(
                existingUser.id
              )}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: existingUser.id,
                  email: userProfile.email,
                  first_name: userProfile.given_name,
                  last_name: userProfile.family_name,
                  nickname: userProfile.nickname,
                  email_verified: userProfile.email_verified,
                  updated_at: new Date(),
                }),
              }
            );

            if (updateResponse.ok) {
              await updateResponse.json();
              router.replace("/pages/home");

              new Toast({
                toastMsg: "Welcome back, " + userProfile.nickname,
                autoCloseTime: 3000,
                theme: "dark",
                type: "success",
              });
            }
            return;
          }

          console.log("No existing user, creating new user.");

          const createResponse = await fetch(`${backendUrl}/api/users/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userProfile.email,
              first_name: userProfile.given_name,
              last_name: userProfile.family_name,
              nickname: userProfile.nickname,
              email_verified: userProfile.email_verified,
            }),
          });

          if (createResponse.ok) {
            await createResponse.json();
            router.replace("/pages/home");
            console.log("New user created successfully.");

            new Toast({
              toastMsg: "Welcome, " + userProfile.nickname,
              autoCloseTime: 3000,
              theme: "dark",
              type: "success",
            });

            const email = await fetch(`${backendUrl}/api/email`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: userProfile.email,
                subject: "Welcome to WeatherWise!",
                html: `<p>Hi ${userProfile.nickname}, welcome to WeatherWise!</p> 
                <img src="cid:welcome_image"/>
                <a href="http://localhost:3000" style=color:blue>Get Your Weather Now!</a>`,
                image: "../images/image.png",
              }),
            });
            const data = await email.json();
            console.log(data);
          }
        }
      } catch (err) {
        console.log("Error in Authentication", err);
        router.replace("/");

        setTimeout(() => {
          new Toast({
            toastMsg: "Error Occurred - Please Try Again",
            autoCloseTime: 3000,
            theme: "dark",
            type: "error",
          });
        }, 500);
      }
    };

    checkAuth();
  }, [router]);

  if (!user) return null;
  return <HomePage user={user} />;
};

const HomePage = ({ user }: { user: any }) => {
  const [weather, setWeather] = useState("thunderstorm");
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    location: "London",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    description: "Partly Cloudy",
    timezone: "Europe/London"
  });
  const router = useRouter();
  const state = useGeolocation();

  let currentToast = 0;
  const maxToast = 1;

  const handleClick = () => {
    if (currentToast >= maxToast) return;
    new Toast({
      toastMsg: "Hello World",
      autoCloseTime: 3000,
      theme: "dark",
      type: "error",
      onClose: () => {
        currentToast--;
      },
    });
    currentToast++;
  };

  const handleRain = () => setWeather("rain");
  const handleThunder = () => setWeather("thunderstorm");
  const handleSnow = () => setWeather("snow");
  const handleClear = () => setWeather("clear");

const fetchWeather = async (cityName: string) => {
  try {
    console.log("Fetching weather for:", cityName);
    const res = await fetch(
      `${backendUrl}/api/weather?city=${encodeURIComponent(cityName)}`
    );
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!data) return;

    console.log("=== Current Weather ===")
      
     
      setWeatherData({
        temperature: Math.round(data.current.temp_c),
        location: `${data.location.name}, ${data.location.country}`,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_mph),
        visibility: Math.round(data.current.vis_miles),
        pressure: Math.round(data.current.pressure_mb),
        description: data.current.condition.text,
        timezone: data.location.tz_id
      });
      
      
      const condition = data.current.condition.text.toLowerCase();
      console.log("Weather condition from API:", condition);
      
      if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
        setWeather('rain');
      } else if (condition.includes('thunder') || condition.includes('storm')) {
        setWeather('thunderstorm');
      } else if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet')) {
        setWeather('snow');
      } else if (condition.includes('clear') || condition.includes('sunny')) {
        setWeather('clear');
      } else if (condition.includes('partly')) {
        setWeather('partly-cloudy');
      } else if (condition.includes('cloud') || condition.includes('overcast')) {
        setWeather('cloudy');
      } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
        setWeather('mist');
      } else {
        setWeather('clear'); // default
      }
      

    Object.entries(data.current).forEach(([key, value]) => {
      console.log(key, ":", value);
    });

console.log("7 Day Forecast: ");
if (data.forecast && Array.isArray(data.forecast.forecastday)) {
  data.forecast.forecastday.forEach((day: any) => {
    console.log("Date:", day.date);
    console.log("Max Temp:", day.day.maxtemp_c, "°C");
    console.log("Min Temp:", day.day.mintemp_c, "°C");
    console.log("Condition:", day.day.condition.text);
    console.log("---");
  });
} else {
  console.log("No forecast data available");

    }
  } catch (err) {
    console.error("Error occurred at fetchWeather", err);
  }
};


  useEffect(() => {
    fetchWeather("Houston");
  }, []);

  const getBackground = (weather: string) => {
    switch (weather?.toLowerCase()) {
      case "clear":
        return "from-sky-300 to-yellow-200";
      case "rain":
        return "from-gray-700 to-gray-800";
      case "cloudy":
        return "from-gray-200 to-gray-400";
      case "snow":
        return "from-gray-400 to-gray-400";
      case "thunderstorm":
        return "from-gray-800 to-gray-900";
      case "mist":
      case "fog":
        return "from-gray-300 to-gray-500";
      case "partly-cloudy":
        return "from-blue-300 to-gray-300";
      default:
        return "from-blue-200 to-blue-400";
    }
  };

  return (
    <div
      className={`min-h-screen z-[1] flex flex-col items-center text-gray-800 transition-all duration-700 bg-gradient-to-b p-4 ${getBackground(
        weather
      )}`}
    >
      <div className="fixed inset-0 z-[0] pointer-events-none w-screen h-screen flex items-center justify-center">
        {weather === "rain" && <GoodRainAnimation type="rain" />}
        {weather === "thunderstorm" && (
          <GoodRainAnimation type="thunderstorm" />
        )}
        {weather === "snow" && <RainAnimation type="drizzle" />}
      </div>

      <TopBar onCitySelect={fetchWeather} />

    
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-8 z-[2] px-4 lg:h-[500px]">
        <div className="lg:col-span-2 h-full">
          <ForecastCard 
            weather={weather} 
            temperature={weatherData.temperature}
            location={weatherData.location}
            description={weatherData.description}
            timezone={weatherData.timezone}
          />
        </div>
        
        <div className="space-y-6 h-full flex flex-col">
          <div className="flex-1">
            <TemperatureCard 
              temperature={weatherData.temperature}
              location={weatherData.location}
              timezone={weatherData.timezone}
            />
          </div>
          <div className="flex-1">
            <WeatherDetailsCard 
              humidity={weatherData.humidity}
              windSpeed={weatherData.windSpeed}
              visibility={weatherData.visibility}
              pressure={weatherData.pressure}
            />
          </div>
        </div>
      </div>

      {user && (
        <div className="z-[2] bg-white/30 backdrop-blur-md p-4 rounded-xl mt-4 text-center">
          <img
            className="w-16 h-16 mx-auto mb-2"
            src={user.picture}
            alt={user.name}
          />
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-sm">{user.email}</p>
        </div>
      )}

      <h2 className="text-white">
        {state.loading
          ? "Getting location..."
          : state.latitude && state.longitude
          ? `Latitude: ${state.latitude} Longitude: ${state.longitude}`
          : "Location unavailable - Enable Location Again"}
      </h2>

      <button className="bg-blue-50" onClick={handleClick}>
        Click Me
      </button>

      <button
        className={`${
          weather === "clear" ? "bg-green-400 hover:bg-green-300" : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={handleClear}
      >
        Sunny
      </button>

      <button
        className={`${
          weather === "snow" ? "bg-green-400 hover:bg-green-300" : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={handleSnow}
      >
        Snowy Weather
      </button>

      <button
        className={`${
          weather === "rain" ? "bg-green-400 hover:bg-green-300" : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={handleRain}
      >
        Rainy Weather
      </button>

      <button
        className={`${
          weather === "thunderstorm"
            ? "bg-green-400 hover:bg-green-300"
            : "bg-black"
        } text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]`}
        onClick={handleThunder}
      >
        Thundery Weather
      </button>

      <button
        className="bg-black text-white font-bold py-2 px-6 rounded mb-6 mt-6 z-[2]"
        onClick={() => router.push("/")}
      >
        Back to main page
      </button>
    </div>
  );
};

export default HomePageWrapper;
