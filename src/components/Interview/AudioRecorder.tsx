import { useState, useRef } from "react";
import toWav from "audiobuffer-to-wav";
import { Mic, Loader2, XCircle, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import AudioRecorderProgress from "./AudioRecorderProgress";

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
  const [paused, setPaused] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const shouldSendRef = useRef(false);

  const { mutateAsync: sendAudioMutation, isPending: isProcessing } = useMutation({
    mutationFn: (formData: FormData) => onSend(formData),
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      shouldSendRef.current = false;

      setPaused(false);

      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);

      mediaRecorder.onstop = async () => {
        if (!shouldSendRef.current) {
          // discard
          audioChunksRef.current = [];
          setRecording(false);
          return;
        }

        if (audioChunksRef.current.length === 0) {
          // Nothing recorded - do NOT send
          setRecording(false);
          return;
        }
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioCtx = new AudioContext();
          const decoded = await audioCtx.decodeAudioData(arrayBuffer);
          const wavBuffer = toWav(decoded);
          const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });        
            await audioCtx.close();

          const formData = new FormData();
          formData.append("audio", wavBlob, "recording.wav");
          // formData.append("text", "");
          formData.append("sessionId", sessionId);

  
          await sendAudioMutation(formData);
        } catch (err) {
          console.error("Audio send failed:", err);
        } finally {
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

  const stopAndSend = () => {
    shouldSendRef.current = true;
    setRecording(false); 
    stopRecording();
  };

  const cancelRecording = () => {
    shouldSendRef.current = false;
    setRecording(false);
    stopRecording();
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setPaused(false);
    }
  };


  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "inactive") return;
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
  };


  return (
    <div className="flex gap-2">
      {!recording && (
        <button onClick={startRecording} disabled={disabled}>
          <Mic className="text-indigo-600 cursor-pointer
           hover:text-indigo-800 hover:"/>
        </button>
      )}

      {recording && (
        <div className="flex items-center gap-2">
          <button
            onClick={cancelRecording}
            disabled={isProcessing}
            className="cursor-pointer
            rounded-full transition-opacity"
          >
            <XCircle
              className={`${
                isProcessing ? "text-red-600 opacity-50 cursor-not-allowed" 
                : "text-indigo-600 hover:text-indigo-800 h-6 w-6"
              }`}
            />
          </button>

            <AudioRecorderProgress 
              recording={recording} 
              paused={paused}
              onPause={pauseRecording}
              onResume={resumeRecording}
              maxDuration={300}      
            />

          <button
            onClick={stopAndSend}
            disabled={isProcessing}
          >
            {isProcessing 
            ? <Loader2 className="animate-spin h-6 w-6 text-indigo-600" /> 
            : <Send className="text-indigo-600 rounded-full rotate-50
            border fill-current border-indigo-600 p-1
            hover:text-indigo-800 hover:border-indigo-800
            cursor-pointer h-6 w-6"/>}
          </button>
        </div>
      )}
    </div>

  );
}
