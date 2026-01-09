import { useEffect, useRef, useState } from "react";

export function WaveformAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnd = () => {
      setPlaying(false);
      setCurrentTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    const onError = () => setError(true);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing]);

  const toggle = () => {
    if (!audioRef.current) return;

    if (!error) {
      playing ? audioRef.current.pause() : audioRef.current.play();
      setPlaying(!playing);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="text-sm text-gray-300 italic">
        Voice no longer available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition p-1.5 flex-shrink-0"
        >
          {playing ? "❚❚" : "▶"}
        </button>

        <div className="flex items-end gap-1 h-6 flex-shrink-0">
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className={`w-1 rounded bg-indigo-500 ${
                playing ? "animate-waveform" : ""
              }`}
              style={{
                height: `${6 + (i % 5) * 4}px`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>

        {/* Time display */}
        <div className="flex items-center gap-1 text-xs text-gray-300 flex-shrink-0">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-indigo-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
