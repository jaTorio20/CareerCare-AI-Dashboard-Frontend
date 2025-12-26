import { useState, useRef } from "react";
import toWav from "audiobuffer-to-wav";
import { Mic, StopCircle, Loader2 } from "lucide-react";

export default function AudioRecorder({
  sessionId,
  onSend,
  disabled,
}: {
  sessionId: string;
  onSend: (formData: FormData) => Promise<any>; // async
  disabled?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioCtx = new AudioContext();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        const wavBuffer = toWav(decoded);
        const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

        const formData = new FormData();
        formData.append("audio", wavBlob, "recording.wav");
        formData.append("text", "");
        formData.append("sessionId", sessionId);

        try {
          await onSend(formData); 
          setRecording(false); 
        } catch (err) {
          console.error("Audio send failed:", err);
          setRecording(false); 
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone. Check permissions and device.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled}
        className={`
          relative flex items-center justify-center
          h-9 w-10 rounded-full
          transition-all duration-200 ease-out
          transform active:translate-y-1px active:shadow-inner
          ${recording
            ? `bg-linear-to-b from-red-400 to-red-600 shadow-[0_10px_25px_-5px_rgba(239,68,68,0.6)]`
            : disabled
            ? `bg-gray-300 shadow-inner cursor-not-allowed`
            : `bg-linear-to-b from-indigo-400 to-indigo-700 
               shadow-[0_10px_25px_-5px_rgba(99,102,241,0.6)] 
               hover:shadow-[0_14px_30px_-6px_rgba(99,102,241,0.7)] 
               hover:scale-[1.03] active:scale-[0.97]`}
          text-white
        `}
      >
        {/* Inner shine for 3D look */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 blur" />

        {/* Recording glow */}
        {recording && <span className="absolute inset-0 rounded-full ring-4 ring-red-400/40 animate-ping" />}

        {/* Icon */}
        {disabled ? (
          <Loader2 className="h-6 w-6 animate-spin relative z-10" />
        ) : recording ? (
          <StopCircle className="h-7 w-7 relative z-10" />
        ) : (
          <Mic className="h-5 w-5 relative z-10" />
        )}
      </button>
    </div>
  );
}
