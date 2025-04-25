'use client';

import { useState, useEffect, useRef } from 'react';

export default function TakeABreath() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'quick-inhale' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(3);
  const [scale, setScale] = useState(1);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // Phase durations in seconds
  const phaseDurations = {
    inhale: 3,
    'quick-inhale': 1,
    exhale: 8
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let animationFrame: number;

    if (isRunning) {
      startTimeRef.current = Date.now();
      
      timer = setInterval(() => {
        // Check if 5 minutes have passed
        if (startTimeRef.current && Date.now() - startTimeRef.current >= 5 * 60 * 1000) {
          handleStop();
          return;
        }

        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            switch (currentPhase) {
              case 'inhale':
                setCurrentPhase('quick-inhale');
                setScale(1.1);
                return phaseDurations['quick-inhale'];
              case 'quick-inhale':
                setCurrentPhase('exhale');
                setScale(1.2);
                return phaseDurations.exhale;
              case 'exhale':
                setCurrentPhase('inhale');
                setScale(1);
                return phaseDurations.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);

      // Animate the breathing circle
      const animate = () => {
        if (currentPhase === 'inhale' || currentPhase === 'quick-inhale') {
          setScale((prev) => Math.min(prev + 0.05, 1.2));
        } else if (currentPhase === 'exhale') {
          setScale((prev) => Math.max(prev - 0.05, 1));
        }
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(animationFrame);
    };
  }, [isRunning, currentPhase]);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    if (audioRef.current && isSoundOn) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioError('Failed to play audio. Please try clicking the sound button again.');
      });
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setCurrentPhase('inhale');
    setTimeLeft(phaseDurations.inhale);
    setScale(1);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleSound = () => {
    const newSoundState = !isSoundOn;
    setIsSoundOn(newSoundState);
    
    if (audioRef.current) {
      if (newSoundState && isRunning) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setAudioError('Failed to play audio. Please try clicking again.');
          setIsSoundOn(false);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'bg-teal-400';
      case 'quick-inhale':
        return 'bg-emerald-400';
      case 'exhale':
        return 'bg-sky-400';
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Inhale through nose (80%)';
      case 'quick-inhale':
        return 'Take a second quick inhale';
      case 'exhale':
        return 'Exhale through mouth';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Take a Breath</h2>
      
      <div className="flex flex-col items-center space-y-3">
        {/* Breathing Circle */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div
            className={`absolute w-28 h-28 rounded-full ${getPhaseColor()} transition-transform duration-1000`}
            style={{
              transform: `scale(${scale})`,
            }}
          />
        </div>

        {/* Phase Text */}
        <div className="text-lg font-medium text-gray-700">
          {getPhaseText()}
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Stop
            </button>
          )}
          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSoundOn 
                ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 text-white'
            }`}
          >
            {isSoundOn ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
        </div>

        {/* Citation */}
        <div className="text-xs text-center text-gray-400 mt-2">
          Cyclic Sigh - Balban, Y., Spiegel, D., et al. (2023)
        </div>

        {audioError && (
          <p className="text-red-500 text-sm">{audioError}</p>
        )}
      </div>
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/calming-music.mp3"
        loop
        preload="auto"
        onError={(e) => {
          console.error('Audio error:', e);
          setAudioError('Failed to load audio file. Please check your internet connection and try again.');
        }}
        onCanPlay={() => {
          console.log('Audio can play');
          setAudioError(null);
        }}
      />
    </div>
  );
} 