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
  onDayClick?: (dayIndex: number | null) => void;
  selectedDayIndex?: number | null;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  forecast = [],
  isNight = false,
  onDayClick,
  selectedDayIndex = null,
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
        {forecast && forecast.length > 0 ? (
          <div className="w-full mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">7-Day Forecast</h3>
              {selectedDayIndex !== null && onDayClick && (
                <button
                  onClick={() => onDayClick(null)}
                  className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition-all duration-200"
                >
                  Show Today
                </button>
              )}
            </div>
            <div className="grid grid-cols-7 gap-4 w-full">
              {forecast.map((day, idx) => {
                if (!day) return null;
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => onDayClick && onDayClick(idx)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? "bg-white/30 ring-2 ring-white/50 scale-105"
                        : "bg-white/10 hover:bg-white/20 hover:scale-105"
                    } cursor-pointer`}
                  >
                    <span className={`text-xs font-semibold ${
                      isSelected ? "text-white" : "text-gray-300"
                    }`}>
                      {day.day || '--'}
                    </span>
                    <div className="w-8 h-8 mb-1">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <span className={`text-sm ${
                      isSelected ? "text-white font-semibold" : "text-white"
                    }`}>
                      {day.maxTemp || '--'} / {day.minTemp || '--'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full mt-4">
            <p className="text-white/60 text-sm text-center">Forecast data loading...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
