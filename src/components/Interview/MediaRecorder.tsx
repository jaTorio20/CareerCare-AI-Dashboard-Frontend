import { useState, useRef } from "react";
import toWav from "audiobuffer-to-wav";

export default function ChatInput({
  sessionId,
  onSend,
}: {
  sessionId: string;
  onSend: (formData: FormData) => void;
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        // Decode webm → AudioBuffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioCtx = new AudioContext();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);

        // Convert AudioBuffer → WAV using audiobuffer-to-wav
        const wavBuffer = toWav(decoded);
        const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

        // Build FormData with wavBlob
        const formData = new FormData();
        formData.append("audio", wavBlob, "recording.wav");
        formData.append("text", "");
        formData.append("sessionId", sessionId);

        console.log("Sending WAV FormData:", [...formData.entries()]);
        onSend(formData);
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
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setRecording(false);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`p-2 rounded ${
          recording ? "bg-red-500" : "bg-blue-500"
        } text-white`}
      >
        {recording ? "Stop" : "🎤 Record"}
      </button>
    </div>
  );
}
