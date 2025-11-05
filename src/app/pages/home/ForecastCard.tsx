import React from 'react';
import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Car } from "lucide-react"
import PartlyCloudyRain from './WeatherIcons/PartlyCloudyRain';
import Sunny from './WeatherIcons/Sunny';
import Thunderstorm from './WeatherIcons/Thunderstorm';
import Snow from './WeatherIcons/Snow';
import NightClear from './WeatherIcons/NightClear';
import NightRain from './WeatherIcons/NightRain';
import NightSnow from './WeatherIcons/NightSnow';
import SunnySnow from './WeatherIcons/SunnySnow';
import Cloudy from './WeatherIcons/Cloudy';





interface ForecastCardProps {
    weather: string;
    temperature?: number;
    location?: string;
    description?: string;
}

export function ForecastCard({weather, temperature = 22, location = "London", description}: ForecastCardProps) {

    const [time,setTime] = useState('00:00');

    const getWeatherDescription = (weather: string) => {
        switch (weather?.toLowerCase()) {
            case "rain":
                return "Light Rain";
            case "thunderstorm":
                return "Thunderstorm";
            case "snow":
                return "Snow Showers";
            case "cloudy":
                return "Cloudy";
            case "clear":
                return "Sunny";
            default:
                return "Partly Cloudy";
        }
    };

    console.log(weather)
    return (
        <Card className="w-full h-full bg-white/20 backdrop-blur-md border-white/30 hover:scale-102 animate-in fade-in md:slide-in-from-bottom-12 md:duration-600 duration-700 cursor-pointer transition-all ease-in-out overflow-hidden">
            <CardContent className="p-8 h-full flex flex-col justify-between overflow-hidden">
                <div className="text-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white mb-2 truncate">{location}</h2>
                    <p className="text-white/70 text-sm mb-6 line-clamp-2">{description || getWeatherDescription(weather)}</p>
                </div>
                
                <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
                    <div className="flex items-center justify-center max-w-xs max-h-xs">
                        {(() => {
                            switch (weather) {
                                case "rain":
                                    return <PartlyCloudyRain />;
                                case "thunderstorm":
                                    return <Thunderstorm />;
                                case "snow":
                                    return <Snow />
                                case "clear":
                                    return <Sunny/>
                                default:
                                    return <Sunny />;
                            }
                        })()}
                    </div>
                </div>
                
                <div className="text-center flex-shrink-0">
                    <div className="text-6xl font-bold text-white mb-2">
                        {temperature}°
                    </div>
                    <p className="text-white/70 text-sm">Feels like {temperature + 2}°</p>
                </div>
            </CardContent>
        </Card>
    )
}