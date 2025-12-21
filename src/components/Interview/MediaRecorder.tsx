import { useState, useRef } from "react";

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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("text", ""); // explicitly empty
      formData.append("sessionId", sessionId);
      // send to backend
      onSend(formData);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`p-2 rounded ${recording ? "bg-red-500" : "bg-blue-500"} text-white`}
      >
        {recording ? "Stop" : "🎤 Record"}
      </button>
    </div>
  );
}
