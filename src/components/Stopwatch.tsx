'use client';

import { useState, useEffect, useRef } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [workDuration, setWorkDuration] = useState(25); // Default to 25 minutes
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const POMODORO_BREAK_TIME = 5 * 60 * 1000; // 5 minutes
  const POMODORO_WORK_TIME = workDuration * 60 * 1000; // workDuration minutes

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(time => {
          if (isPomodoroMode) {
            const newTime = time - 1000;
            if (newTime <= 0) {
              if (audioRef.current) {
                audioRef.current.play();
              }
              setIsBreakTime(!isBreakTime);
              return isBreakTime ? POMODORO_WORK_TIME : POMODORO_BREAK_TIME;
            }
            return newTime;
          }
          return time + 1000;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isPomodoroMode, isBreakTime, workDuration]);

  const formatTime = () => {
    const minutes = Math.floor(Math.abs(time) / 60000);
    const seconds = Math.floor((Math.abs(time) % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(isPomodoroMode ? POMODORO_WORK_TIME : 0);
    setIsBreakTime(false);
  };

  const handleModeToggle = () => {
    handleReset();
    setIsPomodoroMode(!isPomodoroMode);
  };

  const handleWorkDurationChange = (duration: number) => {
    setWorkDuration(duration);
    if (isPomodoroMode && !isBreakTime) {
      setTime(duration * 60 * 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isPomodoroMode ? 'Pomodoro Timer' : 'Stopwatch'}
          </h2>
          <button
            onClick={handleModeToggle}
            className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
          >
            {isPomodoroMode ? 'Switch to Stopwatch' : 'Switch to Pomodoro'}
          </button>
        </div>
        
        {isPomodoroMode && (
          <>
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => handleWorkDurationChange(25)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  workDuration === 25
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                25 min
              </button>
              <button
                onClick={() => handleWorkDurationChange(50)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  workDuration === 50
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                50 min
              </button>
            </div>
            <div className="text-center mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isBreakTime ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isBreakTime ? 'Break Time' : 'Work Time'}
              </span>
            </div>
          </>
        )}

        <div className="text-4xl font-mono mb-4 text-center">{formatTime()}</div>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              if (isPomodoroMode && !isRunning) {
                setTime(isBreakTime ? POMODORO_BREAK_TIME : POMODORO_WORK_TIME);
              }
              setIsRunning(!isRunning);
            }}
            className={`px-4 py-2 rounded-md font-medium ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleReset}
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