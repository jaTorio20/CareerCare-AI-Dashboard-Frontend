import { useQuery } from "@tanstack/react-query";
import { getAudioUrl } from "@/api/interview";
import { WaveformAudioPlayer } from "./WaveformAudioPlayer";

export default function AudioMessage({
  sessionId,
  audioKey,
}: {
  sessionId: string;
  audioKey: string;
}) {
  const { data: url, isLoading, isError } = useQuery({
    queryKey: ["audio-url", sessionId, audioKey],
    queryFn: () => getAudioUrl(sessionId, audioKey),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!sessionId && !!audioKey,
  });

  if (isLoading) {
    return (
      <div className="mt-2 text-sm text-gray-400">
        Loading audio…
      </div>
    );
  }

  if (isError || !url) {
    return (
      <div className="mt-2 text-sm text-red-500">
        Failed to load audio
      </div>
    );
  }

  return <WaveformAudioPlayer src={url} />;
}
