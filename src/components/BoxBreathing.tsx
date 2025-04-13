'use client';

import { useState, useEffect, useRef } from 'react';

export default function BoxBreathing() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [scale, setScale] = useState(1);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Phase durations in seconds
  const phaseDurations = {
    inhale: 4,
    hold: 2,
    exhale: 6,
    rest: 2
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let animationFrame: number;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            switch (currentPhase) {
              case 'inhale':
                setCurrentPhase('hold');
                setScale(1.2);
                return phaseDurations.hold;
              case 'hold':
                setCurrentPhase('exhale');
                setScale(1.2);
                return phaseDurations.exhale;
              case 'exhale':
                setCurrentPhase('rest');
                setScale(1);
                return phaseDurations.rest;
              case 'rest':
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
        if (currentPhase === 'inhale') {
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
      case 'hold':
        return 'bg-emerald-400';
      case 'exhale':
        return 'bg-sky-400';
      case 'rest':
        return 'bg-indigo-400';
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Box Breathing Exercise</h2>
      
      <div className="flex flex-col items-center space-y-3">
        {/* Breathing Circle */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div
            className={`absolute w-28 h-28 rounded-full ${getPhaseColor()} transition-transform duration-1000`}
            style={{
              transform: `scale(${scale})`,
            }}
          />
          <div className="absolute text-white text-2xl font-bold">
            {timeLeft}
          </div>
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

        {audioError && (
          <p className="text-red-500 text-sm">{audioError}</p>
        )}

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
    </div>
  );
} 