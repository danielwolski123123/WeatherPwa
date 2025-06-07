
export type ForecastDay = {
  datetime: string;
  tempmax: number;
  tempmin: number;
  icon: string;
};

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

export type ForecastData = {
  days: ForecastDay[];
};
