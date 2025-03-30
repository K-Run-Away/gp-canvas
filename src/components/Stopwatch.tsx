'use client';

import { useState, useEffect } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time => time + 1000), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Stopwatch</h2>
        <div className="text-4xl font-mono mb-4 text-center">{formatTime()}</div>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-md font-medium ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTime(0);
            }}
            className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Normal Values</h2>
          <span className="text-sm text-gray-500 italic">APLS, Edition 5</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age (years)</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Under 1</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1–2</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2–5</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">5–12</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Over 12</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Respiratory rate</td>
                <td className="px-4 py-3 text-sm text-gray-500">30–40</td>
                <td className="px-4 py-3 text-sm text-gray-500">25–35</td>
                <td className="px-4 py-3 text-sm text-gray-500">25–30</td>
                <td className="px-4 py-3 text-sm text-gray-500">20–25</td>
                <td className="px-4 py-3 text-sm text-gray-500">15–20</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Heart rate</td>
                <td className="px-4 py-3 text-sm text-gray-500">110–160</td>
                <td className="px-4 py-3 text-sm text-gray-500">100–150</td>
                <td className="px-4 py-3 text-sm text-gray-500">95–140</td>
                <td className="px-4 py-3 text-sm text-gray-500">80–120</td>
                <td className="px-4 py-3 text-sm text-gray-500">60–100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 