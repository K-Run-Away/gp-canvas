'use client';

import { useState, useEffect, useRef } from 'react';

interface TimeSection {
  name: string;
  color: string;
  startMinute: number;
}

export default function SCATimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeMinutes, setTotalTimeMinutes] = useState<number>(0);
  const [clinicalTimeMinutes, setClinicalTimeMinutes] = useState<number>(0);
  const [warningTimeMinutes, setWarningTimeMinutes] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [currentSection, setCurrentSection] = useState<TimeSection | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Validate and prepare time sections
  const prepareSections = (): TimeSection[] => {
    if (!totalTimeMinutes || totalTimeMinutes <= 0) return [];

    const sections: TimeSection[] = [
      {
        name: 'Initial Response',
        color: 'bg-blue-500',
        startMinute: 0
      },
      {
        name: 'Clinical Management',
        color: 'bg-green-500',
        startMinute: clinicalTimeMinutes
      },
      {
        name: 'Warning',
        color: 'bg-red-500',
        startMinute: warningTimeMinutes
      }
    ].filter(section => section.startMinute < totalTimeMinutes)
     .sort((a, b) => a.startMinute - b.startMinute);

    return sections;
  };

  // Get current section based on time left
  const getCurrentSection = (timeLeftSeconds: number): TimeSection | null => {
    const sections = prepareSections();
    const currentMinute = Math.floor((totalTimeMinutes * 60 - timeLeftSeconds) / 60);
    
    for (let i = sections.length - 1; i >= 0; i--) {
      if (currentMinute >= sections[i].startMinute) {
        return sections[i];
      }
    }
    return null;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start timer
  const handleStart = () => {
    if (!totalTimeMinutes || totalTimeMinutes <= 0) return;
    
    setTimeLeft(totalTimeMinutes * 60);
    setIsRunning(true);
    setCurrentSection(prepareSections()[0]);
  };

  // Stop timer
  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(0);
    setCurrentSection(null);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          const newSection = getCurrentSection(newTime);
          if (newSection?.name !== currentSection?.name) {
            setCurrentSection(newSection);
          }
          return newTime;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, timeLeft, currentSection]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">SCA Timer</h2>
      
      <div className="space-y-4">
        {/* Time Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Time (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={totalTimeMinutes || ''}
              onChange={(e) => setTotalTimeMinutes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Management Start (minute)
            </label>
            <input
              type="number"
              min="0"
              max={totalTimeMinutes}
              value={clinicalTimeMinutes || ''}
              onChange={(e) => setClinicalTimeMinutes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warning Start (minute)
            </label>
            <input
              type="number"
              min="0"
              max={totalTimeMinutes}
              value={warningTimeMinutes || ''}
              onChange={(e) => setWarningTimeMinutes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center ${currentSection?.color || 'bg-gray-200'} transition-colors duration-300`}>
            <div className="text-4xl font-bold text-white">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {currentSection && (
            <div className="text-xl font-medium text-gray-700">
              {currentSection.name}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={!totalTimeMinutes || totalTimeMinutes <= 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Stop
            </button>
          )}
        </div>

        {/* Section Legend */}
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
            <span>Initial Response</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
            <span>Clinical Management</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
            <span>Warning</span>
          </div>
        </div>
      </div>
    </div>
  );
} 