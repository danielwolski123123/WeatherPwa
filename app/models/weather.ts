export type WeatherHour = {
    datetime: string;
    temp: number;
  };
  
  export type WeatherDay = {
    hours: WeatherHour[];
  };
  
  export type WeatherData = {
    days: WeatherDay[];
  };
  