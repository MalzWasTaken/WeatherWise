import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";
import { Wind, Droplets, Eye, Gauge, CloudRain, Sunrise, Sunset } from 'lucide-react';

interface WeatherDetailsCardProps {
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
  isNight?: boolean;
}

export function WeatherDetailsCard({ 
  humidity, 
  windSpeed, 
  visibility, 
  pressure,
  precipitation,
  sunrise,
  sunset,
  isNight = false
}: WeatherDetailsCardProps) {
  return (
    <Card className="w-full h-full bg-white/20 backdrop-blur-md border-white/30 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6 h-full flex flex-col justify-center">
        <h3 className="text-sm font-medium text-white/80 mb-4 text-center">Weather Details</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-300" />
              <span className="text-white/70 text-sm">Humidity</span>
            </div>
            <span className="text-white font-medium">{humidity}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-green-300" />
              <span className="text-white/70 text-sm">Wind</span>
            </div>
            <span className="text-white font-medium">{windSpeed} mph</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-300" />
              <span className="text-white/70 text-sm">Visibility</span>
            </div>
            <span className="text-white font-medium">{visibility} mi</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-orange-300" />
              <span className="text-white/70 text-sm">Pressure</span>
            </div>
            <span className="text-white font-medium">{pressure} hPa</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudRain className="w-4 h-4 text-cyan-300" />
              <span className="text-white/70 text-sm">Precipitation</span>
            </div>
            <span className="text-white font-medium">{precipitation.toFixed(1)} mm</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sunrise className="w-4 h-4 text-yellow-300" />
              <span className="text-white/70 text-sm">Sunrise</span>
            </div>
            <span className="text-white font-medium">{sunrise}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sunset className="w-4 h-4 text-orange-300" />
              <span className="text-white/70 text-sm">Sunset</span>
            </div>
            <span className="text-white font-medium">{sunset}</span>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}