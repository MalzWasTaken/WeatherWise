import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../../../components/ui/card";

interface TemperatureCardProps {
  temperature: number;
  location: string;
  timezone?: string;
  isNight?: boolean;
}

export function TemperatureCard({ temperature, location, timezone = "Europe/London", isNight = false }: TemperatureCardProps) {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleString("en-US", {
        timeZone: timezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setLocalTime(time);
    };

    
    updateTime();

    //Time updates every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <Card className="w-full h-full bg-white/20 backdrop-blur-md border-white/30 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-white/80 mb-2">Local Time</h3>
          <div className="text-3xl font-bold text-white mb-1">
            {localTime}
          </div>
          <p className="text-white/70 text-sm">{location}</p>
        </div>
      </CardContent>
    </Card>
  );
}