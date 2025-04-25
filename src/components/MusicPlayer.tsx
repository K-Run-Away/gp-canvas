import { useState, useRef, useEffect } from 'react';

const tracks = [
  {
    title: "Relaxing Music",
    src: "/audio/relaxing-music.mp3",
    duration: "1:00:00",
    type: "relaxing"
  },
  {
    title: "Energizing Music",
    src: "/audio/energizing-music.mp3",
    duration: "1:00:00",
    type: "energizing"
  },
  {
    title: "Lofi Chill",
    src: "/audio/lofi-chill.mp3",
    duration: "1:00:00",
    type: "lofi"
  }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const switchTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [currentTrack]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Music Player</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tracks.map((track, index) => (
          <button
            key={index}
            onClick={() => switchTrack(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentTrack === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {track.type.charAt(0).toUpperCase() + track.type.slice(1)}
          </button>
        ))}
      </div>

      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      <div className="space-y-4">
        {/* Track Info */}
        <div className="text-center text-gray-700 font-medium">
          {tracks[currentTrack].title}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{currentTime}</div>
          <button
            onClick={togglePlay}
            className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <div className="text-sm text-gray-600">{tracks[currentTrack].duration}</div>
        </div>
      </div>
    </div>
  );
} 