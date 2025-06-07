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
import { WeatherData, ForecastData } from '../models/weather';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

export default function Weather() {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_VISUALCROSSING_API_KEY;

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date}?key=${apiKey}&unitGroup=metric`
      );
      setWeatherData(res.data);
      setError('');

      const forecastRes = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&unitGroup=metric&include=days`
      );
      setForecastData({ days: forecastRes.data.days.slice(0, 5) });
    } catch (err) {
      setError('Nie udało się pobrać danych pogodowych.');
      console.error(err);
    }
  };

  const chartData = weatherData
    ? {
        labels: weatherData.days[0].hours.map((hour) => hour.datetime),
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: weatherData.days[0].hours.map((hour) => hour.temp),
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          },
        ],
      }
    : null;

  return (
    <div
      className={`${
        darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
      } min-h-screen p-4 transition-colors duration-300`}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            {darkMode ? 'Tryb jasny ☀️' : 'Tryb ciemny 🌙'}
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-6">Pogoda z VisualCrossing</h1>

        <div className="mb-4 flex flex-col md:flex-row justify-center gap-2">
          <input
            type="text"
            placeholder="Miasto"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`border p-2 rounded ${
              darkMode
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-black'
            }`}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`border p-2 rounded ${
              darkMode
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-black'
            }`}
          />
        </div>

        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-500 transition-colors mb-8"
        >
          Pobierz prognozę
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {chartData && (
          <div className="my-8 bg-white text-black rounded-xl shadow-lg p-4">
            <Line data={chartData} />
          </div>
        )}

        {forecastData && (
          <div>
            <h2 className="text-2xl font-semibold my-4">
              Prognoza na kolejne dni
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.days.map((day, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-4 text-gray-800 flex flex-col items-center"
                >
                  <p className="font-semibold text-lg mb-2">{day.datetime}</p>
                  <img
                    src={`https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${day.icon}.png`}
                    alt={day.icon}
                    className="h-12 my-2"
                  />
                  <p className="text-red-500 font-medium">🌡 Max: {day.tempmax}°C</p>
                  <p className="text-blue-500 font-medium">🌡 Min: {day.tempmin}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
