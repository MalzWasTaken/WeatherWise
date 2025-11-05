import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";

interface TemperatureCardProps {
  temperature: number;
  location: string;
}

export function TemperatureCard({ temperature, location }: TemperatureCardProps) {
  return (
    <Card className="w-full h-full bg-white/20 backdrop-blur-md border-white/30 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-white/80 mb-2">{location}</h3>
          <div className="text-4xl font-bold text-white mb-1">
            {temperature}°
          </div>
          <p className="text-white/70 text-sm">Current Temperature</p>
        </div>
      </CardContent>
    </Card>
  );
}