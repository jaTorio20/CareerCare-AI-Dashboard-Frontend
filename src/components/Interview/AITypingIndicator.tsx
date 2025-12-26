export default function AITypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className="font-medium">AI</span>
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
