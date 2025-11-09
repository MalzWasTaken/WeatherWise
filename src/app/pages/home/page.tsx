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
import StarBackground from "./StarBackground";
import { FakeProgress } from "./FakeProgress";
import { UserCard} from "./UserCard";
import { AlertCard } from "./AlertCard";

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
            await fetch(
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
            router.replace("/pages/home");
            new Toast({
              toastMsg: "Welcome back, " + userProfile.nickname,
              autoCloseTime: 3000,
              theme: "dark",
              type: "success",
            });
            return;
          }

          console.log("No existing user, creating new user.");
          await fetch(`${backendUrl}/api/users/add`, {
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
          router.replace("/pages/home");
          new Toast({
            toastMsg: "Welcome, " + userProfile.nickname,
            autoCloseTime: 3000,
            theme: "dark",
            type: "success",
          });
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
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    location: "",
    humidity: 0,
    windSpeed: 0,
    visibility: 0,
    pressure: 0,
    precipitation: 0,
    feelsLike: 0,
    sunrise: "06:00 AM",
    sunset: "08:00 PM",
    description: "",
    timezone: "Europe/London",
  });
  const [isNight, setIsNight] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  const router = useRouter();
  const state = useGeolocation();

  useEffect(() => {
    const updateTimeAndNight = () => {
      const now = new Date();
      const currentTime = new Intl.DateTimeFormat("en-US", {
        timeZone: weatherData.timezone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      const currentHour = parseInt(currentTime.split(":")[0], 10);
      const nightTime = currentHour >= 20 || currentHour <= 4;
      setIsNight(nightTime);
    };
    updateTimeAndNight();
    const interval = setInterval(updateTimeAndNight, 60000);
    return () => clearInterval(interval);
  }, [weatherData.timezone]);

  const handleRain = () => setWeather("rain");
  const handleThunder = () => setWeather("thunderstorm");
  const handleSnow = () => setWeather("snow");
  const handleClear = () => setWeather("clear");

  const fetchWeather = async (cityName: string) => {
    try {
      // Extract just the city name if it includes country (e.g., "London, United Kingdom" -> "London")
      const cityOnly = cityName.split(',')[0].trim();

      const res = await fetch(
        `${backendUrl}/api/weather?city=${encodeURIComponent(cityOnly)}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || "Failed to fetch weather" };
        }
        console.error("Weather API error:", errorData);
        new Toast({
          toastMsg: `Failed to fetch weather for ${cityOnly}. Please try again.`,
          autoCloseTime: 4000,
          theme: "dark",
          type: "error",
        });
        return;
      }

      const text = await res.text();
      if (!text) {
        console.error("Empty response from weather API");
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing weather data:", parseError);
        new Toast({
          toastMsg: "Error processing weather data. Please try again.",
          autoCloseTime: 4000,
          theme: "dark",
          type: "error",
        });
        return;
      }

      // Check if response is an error or missing required data
      if (!data || data.error) {
        console.error("Weather API returned error:", data?.error);
        new Toast({
          toastMsg: data?.error?.message || data?.error || "Weather data not available.",
          autoCloseTime: 4000,
          theme: "dark",
          type: "error",
        });
        return;
      }

      // Validate that required data structure exists
      if (!data.current || !data.location) {
        console.error("Invalid weather data structure:", data);
        new Toast({
          toastMsg: "Invalid weather data received. Please try again.",
          autoCloseTime: 4000,
          theme: "dark",
          type: "error",
        });
        return;
      }

      // Extract sunrise and sunset from forecast data
      let sunrise = "06:00 AM";
      let sunset = "08:00 PM";
      if (data.forecast && Array.isArray(data.forecast.forecastday) && data.forecast.forecastday.length > 0) {
        sunrise = data.forecast.forecastday[0].astro.sunrise || sunrise;
        sunset = data.forecast.forecastday[0].astro.sunset || sunset;
      }

      setWeatherData({
        temperature: Math.round(data.current.temp_c),
        location: `${data.location.name}, ${data.location.country}`,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_mph),
        visibility: Math.round(data.current.vis_miles),
        pressure: Math.round(data.current.pressure_mb),
        precipitation: data.current.precip_mm || 0,
        feelsLike: Math.round(data.current.feelslike_c),
        sunrise: sunrise,
        sunset: sunset,
        description: data.current.condition.text,
        timezone: data.location.tz_id,
      });

      const condition = data.current.condition.text.toLowerCase();
      if (
        condition.includes("rain") ||
        condition.includes("drizzle") ||
        condition.includes("shower")
      )
        setWeather("rain");
      else if (condition.includes("thunder") || condition.includes("storm"))
        setWeather("thunderstorm");
      else if (
        condition.includes("snow") ||
        condition.includes("blizzard") ||
        condition.includes("sleet")
      )
        setWeather("snow");
      else if (condition.includes("clear") || condition.includes("sunny"))
        setWeather("clear");
      else if (condition.includes("partly")) setWeather("partly-cloudy");
      else if (condition.includes("cloud") || condition.includes("overcast"))
        setWeather("cloudy");
      else if (
        condition.includes("mist") ||
        condition.includes("fog") ||
        condition.includes("haze")
      )
        setWeather("mist");
      else setWeather("clear");

      // Map forecast for UserCard
      if (data.forecast && Array.isArray(data.forecast.forecastday)) {
        const mappedForecast: any[] = data.forecast.forecastday.map(
          (day: any) => ({
            day: new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            condition: day.day.condition.text,
            maxTemp: Math.round(day.day.maxtemp_c) + "°C",
            minTemp: Math.round(day.day.mintemp_c) + "°C",
          })
        );
        setForecastData(mappedForecast);
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      new Toast({
        toastMsg: "An error occurred while fetching weather. Please try again.",
        autoCloseTime: 4000,
        theme: "dark",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const getUserLocationWeather = async () => {
      setIsLoadingWeather(true);
      if (state.latitude && state.longitude) {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${state.latitude}&longitude=${state.longitude}&localityLanguage=en`
          );
          const locationData = await response.json();
          const userCity =
            locationData.city || locationData.locality || "Houston";
          await fetchWeather(userCity);
        } catch (err) {
          console.error("Error getting location:", err);
        }
      }
      setIsLoadingWeather(false);
    };
    getUserLocationWeather();
  }, [state.latitude, state.longitude, state.loading, state.error]);

  const getUserAlerts = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/alerts/email/${encodeURIComponent(user.email)}`
      );
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      const formattedAlerts = data.map((alert: any) => ({
        title: `${alert.city}`,
        description: `Condition: ${alert.weather_type}`,
      }));
      setUserAlerts(formattedAlerts);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  useEffect(() => {
    getUserAlerts();
  }, [weatherData.location]);

  const getBackground = (weather: string, isNight: boolean) => {
    if (isNight) {
      switch (weather?.toLowerCase()) {
        case "clear":
          return "from-indigo-900 to-purple-900";
        case "rain":
          return "from-gray-900 to-black";
        case "cloudy":
          return "from-gray-800 to-gray-900";
        case "snow":
          return "from-slate-800 to-slate-900";
        case "thunderstorm":
          return "from-black to-gray-900";
        case "mist":
        case "fog":
          return "from-gray-700 to-gray-900";
        case "partly-cloudy":
          return "from-blue-900 to-gray-800";
        default:
          return "from-indigo-800 to-purple-800";
      }
    } else {
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
    }
  };

  if (isLoadingWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white">
        <div className="text-center space-y-6">
          <div className="relative w-100">
            <FakeProgress />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Finding your location...</h2>
            <p className="text-blue-100">Getting weather for your area</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen z-[1] flex flex-col items-center text-gray-800 transition-all duration-700 bg-gradient-to-b p-4 ${getBackground(
        weather,
        isNight
      )}`}
    >
      {isNight && weather === "clear" && <StarBackground />}
      <div className="fixed inset-0 z-[0] pointer-events-none w-screen h-screen flex items-center justify-center">
        {weather === "rain" && <GoodRainAnimation type="rain" />}
        {weather === "thunderstorm" && (
          <GoodRainAnimation type="thunderstorm" />
        )}
        {weather === "snow" && <RainAnimation type="drizzle" />}
      </div>

      <TopBar onCitySelect={fetchWeather} />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-8 z-[2] px-4">
        <div className="col-span-1 lg:col-span-3 w-full">
          <UserCard user={user} forecast={forecastData} />
        </div>

        {/* ForecastCard left */}
        <div className="lg:col-span-2 w-full">
          <ForecastCard
            weather={weather}
            temperature={weatherData.temperature}
            feelsLike={weatherData.feelsLike}
            location={weatherData.location}
            description={weatherData.description}
            timezone={weatherData.timezone}
            isNight={isNight}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6 flex flex-col">
          <TemperatureCard
            temperature={weatherData.temperature}
            location={weatherData.location}
            timezone={weatherData.timezone}
            isNight={isNight}
          />
          <WeatherDetailsCard
            humidity={weatherData.humidity}
            windSpeed={weatherData.windSpeed}
            visibility={weatherData.visibility}
            pressure={weatherData.pressure}
            precipitation={weatherData.precipitation}
            sunrise={weatherData.sunrise}
            sunset={weatherData.sunset}
            isNight={isNight}
          />
        </div>

        <div className="col-span-1 lg:col-span-3 w-full">
          <AlertCard
            alerts={weatherAlerts}
            selectedCity={weatherData.location}
          />
        </div>
      </div>

      {/* Weather buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          className={`${
            weather === "clear" ? "bg-green-400 hover:bg-green-300" : "bg-black"
          } text-white font-bold py-2 px-6 rounded`}
          onClick={handleClear}
        >
          Sunny
        </button>
        <button
          className={`${
            weather === "snow" ? "bg-green-400 hover:bg-green-300" : "bg-black"
          } text-white font-bold py-2 px-6 rounded`}
          onClick={handleSnow}
        >
          Snowy Weather
        </button>
        <button
          className={`${
            weather === "rain" ? "bg-green-400 hover:bg-green-300" : "bg-black"
          } text-white font-bold py-2 px-6 rounded`}
          onClick={handleRain}
        >
          Rainy Weather
        </button>
        <button
          className={`${
            weather === "thunderstorm"
              ? "bg-green-400 hover:bg-green-300"
              : "bg-black"
          } text-white font-bold py-2 px-6 rounded`}
          onClick={handleThunder}
        >
          Thundery Weather
        </button>
        <button
          className="bg-black text-white font-bold py-2 px-6 rounded"
          onClick={() => router.push("/")}
        >
          Back to main page
        </button>
      </div>
    </div>
  );
};

export default HomePageWrapper;
