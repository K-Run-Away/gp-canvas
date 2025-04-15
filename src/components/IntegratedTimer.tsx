'use client';

import { useState, useEffect, useRef } from 'react';

type TimerMode = 'stopwatch' | 'pomodoro' | 'sca';
type SCAPhase = 'data' | 'management' | 'warning';

export default function IntegratedTimer() {
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [scaPhase, setSCAPhase] = useState<SCAPhase>('data');
  const [workDuration, setWorkDuration] = useState(25); // Default to 25 minutes
  
  const workerRef = useRef<Worker | null>(null);

  // Constants
  const POMODORO_WORK_TIME = workDuration * 60; // workDuration minutes
  const POMODORO_BREAK_TIME = 5 * 60; // 5 minutes in seconds
  const SCA_TOTAL_TIME = 12 * 60; // 12 minutes in seconds
  const SCA_MANAGEMENT_TIME = 6 * 60; // 6 minutes in seconds
  const SCA_WARNING_TIME = 1 * 60; // 1 minute in seconds

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('../workers/timerWorker.js', import.meta.url));
    
    workerRef.current.onmessage = (e) => {
      const { timeLeft, pomodoroMode: newPomodoroMode } = e.data;
      setTime(timeLeft);
      if (newPomodoroMode !== pomodoroMode) {
        setPomodoroMode(newPomodoroMode);
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Handle SCA phase transitions
  useEffect(() => {
    if (mode === 'sca' && isRunning) {
      if (time <= SCA_WARNING_TIME && scaPhase !== 'warning') {
        setSCAPhase('warning');
      } else if (time <= SCA_MANAGEMENT_TIME && scaPhase === 'data') {
        setSCAPhase('management');
      }
    }
  }, [time, mode, scaPhase, isRunning]);

  const handleStart = () => {
    if (mode === 'pomodoro') {
      setTime(POMODORO_WORK_TIME);
      setPomodoroMode('work');
    } else if (mode === 'sca') {
      setTime(SCA_TOTAL_TIME);
      setSCAPhase('data');
    }
    setIsRunning(true);
    
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'START',
        data: {
          initialTime: mode === 'pomodoro' ? POMODORO_WORK_TIME : 
                     mode === 'sca' ? SCA_TOTAL_TIME : 0,
          mode,
          pomodoroMode,
          workDuration
        }
      });
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'STOP' });
    }
    setTime(0);
    if (mode === 'pomodoro') {
      setPomodoroMode('work');
    } else if (mode === 'sca') {
      setSCAPhase('data');
    }
  };

  const handleReset = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'RESET',
        data: {
          initialTime: mode === 'pomodoro' ? POMODORO_WORK_TIME : 
                     mode === 'sca' ? SCA_TOTAL_TIME : 0,
          pomodoroMode: 'work'
        }
      });
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'STOP' });
    }
    setMode(newMode);
    if (newMode === 'pomodoro') {
      setTime(POMODORO_WORK_TIME);
    } else if (newMode === 'sca') {
      setTime(SCA_TOTAL_TIME);
    } else {
      setTime(0);
    }
    setPomodoroMode('work');
    setSCAPhase('data');
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerStyles = () => {
    if (mode === 'sca') {
      switch (scaPhase) {
        case 'data':
          return 'bg-blue-500 hover:bg-blue-600';
        case 'management':
          return 'bg-orange-500 hover:bg-orange-600';
        case 'warning':
          return 'bg-red-500 hover:bg-red-600';
      }
    } else if (mode === 'pomodoro') {
      return pomodoroMode === 'work' 
        ? 'bg-green-500 hover:bg-green-600'
        : 'bg-yellow-500 hover:bg-yellow-600';
    }
    return 'bg-purple-500 hover:bg-purple-600';
  };

  const getTimerText = () => {
    if (mode === 'sca') {
      switch (scaPhase) {
        case 'data':
          return 'Data Gathering';
        case 'management':
          return 'Management';
        case 'warning':
          return '1 Minute Left';
      }
    } else if (mode === 'pomodoro') {
      return pomodoroMode === 'work' ? 'Work Time' : 'Break Time';
    }
    return 'Stopwatch';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Timer</h2>
      
      {/* Mode Selection */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => handleModeChange('stopwatch')}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            mode === 'stopwatch' ? 'bg-purple-600' : 'bg-gray-400'
          }`}
        >
          ⏱️ Stopwatch
        </button>
        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            mode === 'pomodoro' ? 'bg-green-600' : 'bg-gray-400'
          }`}
        >
          🍅 Pomodoro
        </button>
        <button
          onClick={() => handleModeChange('sca')}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            mode === 'sca' ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          ⚡ SCA
        </button>
      </div>

      {/* Pomodoro Duration Selection */}
      {mode === 'pomodoro' && !isRunning && (
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={() => {
              setWorkDuration(25);
              setTime(25 * 60);
            }}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              workDuration === 25 ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            25 min
          </button>
          <button
            onClick={() => {
              setWorkDuration(50);
              setTime(50 * 60);
            }}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              workDuration === 50 ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            50 min
          </button>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex flex-col items-center space-y-4">
        <div 
          className={`w-48 h-48 rounded-full flex items-center justify-center ${getTimerStyles()} transition-colors duration-300`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {formatTime(mode === 'stopwatch' ? time : time)}
            </div>
            <div className="text-sm text-white font-medium">
              {getTimerText()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
} 