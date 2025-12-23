import { useState, useRef } from "react";
import toWav from "audiobuffer-to-wav";

export default function ChatInput({
  sessionId,
  onSend,
  disabled,
}: {
  sessionId: string;
  onSend: (formData: FormData) => Promise<any>; // now async
  disabled?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

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
          await onSend(formData); // wait for backend to confirm
          setRecording(false);    // reset only after success
        } catch (err) {
          console.error("Audio send failed:", err);
          setRecording(false);    // also reset on error
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone. Please check permissions and device.");
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
        className={`p-2 rounded ${
          recording ? "bg-red-500" : disabled ? "bg-gray-400" : "bg-blue-500"
        } text-white`}
      >
        {recording ? "Stop" : disabled ? "Uploading…" : "🎤 Record"}
      </button>
    </div>
  );
}
