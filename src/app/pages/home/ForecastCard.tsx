import React from 'react';
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


interface ForecastCardProps {
    weather: string;
}

export function ForecastCard({weather}: ForecastCardProps) {

    console.log(weather)
    return (
        <Card className="w-full max-w-xl  bg-transparent hover:scale-102 animate-in fade-in md:slide-in-from-bottom-12 md:duration-600 duration-700 cursor-pointer transition-all ease-in-out">
            <CardContent>
                <div>
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
                <div>
                    
                </div>
            </CardContent>
        </Card>
    )
}