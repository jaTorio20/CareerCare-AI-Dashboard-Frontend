import { useState, useRef, useEffect } from "react";
import { Play, Square } from "lucide-react";

export default function AudioRecorderProgress({
  recording,
  paused,
  onPause,
  onResume,
  maxDuration = 300,
}: {
  recording: boolean;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  maxDuration?: number;
}) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout  | null>(null);

  useEffect(() => {
    // Only start timer if recording and not paused
    if (recording && !paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = Math.min(prev + 0.1, maxDuration);

          // Stop timer immediately if max reached
          if (next >= maxDuration) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            onPause(); 
          }

          return next;
        });
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
  }, [recording, paused, maxDuration, onPause]);


  const progress = (elapsed / maxDuration) * 100;

  const totalSeconds = Math.floor(elapsed); 
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (

      <div className="relative w-40 h-8 bg-indigo-300 rounded-full overflow-hidden">
        
        <div
          className="absolute h-full bg-indigo-200 transition-all duration-100"
          style={{ width: `${progress}%` }}
        >
        </div>

        <button
          onClick={paused ? onResume : onPause}
          className="absolute left-2 top-1/2 -translate-y-1/2"
        >
          {paused ? (
            // Resume icon
            <Play
              className="h-6 w-6 text-indigo-600 bg-indigo-200 rounded-full p-1
              hover:text-indigo-800 cursor-pointer"
            />
          ) : (
            // Pause icon
            <Square className="text-indigo-600 rounded-full
              border fill-current bg-indigo-200 p-1
              hover:text-indigo-800 hover:border-indigo-800
              cursor-pointer h-6 w-6
              "/>
            )}
        </button>

        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs
          font-bold text-indigo-600 whitespace-nowrap bg-indigo-200 px-2 py-1 rounded-full">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

  );
}
