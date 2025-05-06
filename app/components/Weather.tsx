'use client';

import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { WeatherData } from '../models/weather';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

export default function Weather() {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_VISUALCROSSING_API_KEY;

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date}?key=${apiKey}&unitGroup=metric`
      );
      setWeatherData(res.data);
      setError('');
    } catch (err) {
      setError('Błąd przy pobieraniu danych.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !date) {
      setError('Podaj miasto i datę.');
      return;
    }
    fetchWeather();
  };

  
  const chartData = weatherData?.days?.[0]?.hours
    ? {
        labels: weatherData.days[0].hours.map((hour) => hour.datetime),
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: weatherData.days[0].hours.map((hour) => hour.temp),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      }
    : null;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <h2 className="text-xl font-bold">Sprawdź pogodę</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Miasto"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">
          Pobierz pogodę
        </button>
      </form>
      {error && <p className="text-green-500">{error}</p>}
      {chartData && (
        <div className="w-full h-[400px] mt-4">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}
