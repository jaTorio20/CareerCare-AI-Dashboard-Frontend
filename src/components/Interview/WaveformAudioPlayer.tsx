import { useEffect, useRef, useState } from "react";

export function WaveformAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnd = () => setPlaying(false);
    const onError = () => setError(true);
    
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
    }
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;

    if (!error) {
      playing ? audioRef.current.pause() : audioRef.current.play();
      setPlaying(!playing);
    }
  };

  if (error) {
    return (
      <div className="text-sm text-gray-300 italic">
        Voice no longer available
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={toggle}
        className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      <div className="flex items-end gap-1 h-6">
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


      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
