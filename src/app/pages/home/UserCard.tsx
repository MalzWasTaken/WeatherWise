import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import Sunny from "./WeatherIcons/Sunny";
import PartlyCloudy from "./WeatherIcons/PartlyCloudy";
import PartlyCloudyRain from "./WeatherIcons/PartlyCloudyRain";
import Cloudy from "./WeatherIcons/Cloudy";
import Snow from "./WeatherIcons/Snow";
import Thunderstorm from "./WeatherIcons/Thunderstorm";
import NightClear from "./WeatherIcons/NightClear";
import NightRain from "./WeatherIcons/NightRain";
import NightSnow from "./WeatherIcons/NightSnow";

export interface ForecastData {
  day: string;
  condition?: string;
  maxTemp?: string;
  minTemp?: string;
}

interface UserCardProps {
  user: any;
  forecast?: ForecastData[];
  isNight?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  forecast = [],
  isNight = false,
}) => {
  const getWeatherIcon = (condition?: string) => {
    if (!condition) return isNight ? <NightClear /> : <Sunny />;
    const cond = condition.toLowerCase();
    if (
      cond.includes("rain") ||
      cond.includes("drizzle") ||
      cond.includes("shower")
    )
      return isNight ? <NightRain /> : <PartlyCloudyRain />;
    if (cond.includes("thunder") || cond.includes("storm"))
      return <Thunderstorm />;
    if (
      cond.includes("snow") ||
      cond.includes("blizzard") ||
      cond.includes("sleet")
    )
      return isNight ? <NightSnow /> : <Snow />;
    if (cond.includes("cloud") || cond.includes("overcast")) return <Cloudy />;
    if (cond.includes("partly")) return <PartlyCloudy />;
    if (cond.includes("clear")) return isNight ? <NightClear /> : <Sunny />;
    return isNight ? <NightClear /> : <Sunny />;
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6 flex flex-col gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <img
              src={user.picture || "/default-avatar.png"}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-white">
                {user.nickname || user.name}
              </p>
              <p className="text-sm text-gray-200">{user.email}</p>
            </div>
        </div>
        <div>
        </div>

        {/* 7-Day Forecast Section */}
        {forecast.length > 0 && (
          <div className="grid grid-cols-7 gap-4 w-full mt-4">
            {forecast.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 bg-white/10 rounded-lg"
              >
                <span className="text-xs text-gray-300 font-semibold">
                  {day.day}
                </span>
                <div className="w-8 h-8 mb-1">
                  {getWeatherIcon(day.condition)}
                </div>
                <span className="text-white text-sm">
                  {day.maxTemp} / {day.minTemp}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
