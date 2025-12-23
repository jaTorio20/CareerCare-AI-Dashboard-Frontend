import { useEffect, useState } from "react";
import { getAudioUrl } from "@/api/interview";

export default function AudioPlayer({
  sessionId,
  audioKey,
}: {
  sessionId: string;
  audioKey: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const signedUrl = await getAudioUrl(sessionId, audioKey);
        setUrl(signedUrl);
      } catch (err) {
        console.error("Failed to fetch audio URL:", err);
      }
    })();
  }, [sessionId, audioKey]);

  if (!url) return <span>Loading audio...</span>;

  return <audio controls src={url} className="mt-2 w-full" />;
}
