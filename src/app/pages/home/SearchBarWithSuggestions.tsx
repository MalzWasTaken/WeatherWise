import { Search, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "../../../components/ui/input-group";

const backendUrl = "http://localhost:5005";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarWithSuggestionsProps {
  onCitySelect: (cityName: string) => void;
}

export function SearchBarWithSuggestions({ onCitySelect }: SearchBarWithSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search for city suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchCities(searchTerm);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchCities = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${backendUrl}/api/weather/search?q=${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityClick = (city: City) => {
    const cityName = `${city.name}, ${city.country}`;
    setSearchTerm(cityName);
    setShowDropdown(false);
    onCitySelect(cityName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setShowDropdown(false);
      onCitySelect(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-md relative" ref={searchRef}>
      <InputGroup>
        <InputGroupInput
          placeholder="Search City"
          className="text-white"
          color="white"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        />
        <InputGroupAddon>
          <Search color="white" className={isLoading ? "animate-spin" : ""} />
        </InputGroupAddon>
      </InputGroup>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <div
              key={`${city.lat}-${city.lon}-${index}`}
              className="px-4 py-3 hover:bg-white/30 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
              onClick={() => handleCityClick(city)}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-300" />
                <div>
                  <div className="text-white font-medium">
                    {city.name}
                  </div>
                  <div className="text-white/70 text-sm">
                    {city.region}, {city.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && suggestions.length === 0 && searchTerm.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 text-white/70 text-center">
            No cities found for &ldquo;{searchTerm}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}