export function ResumeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-40 md:w-56 bg-gray-300 rounded animate-pulse" />
        <div className="h-8 w-15 md:w-40 bg-gray-300 rounded-lg animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="group relative bg-white border border-gray-200
              rounded-xl shadow-sm p-6 flex flex-col animate-pulse"
          >
            {/* Resume title */}
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-3" />

            {/* Metadata */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>

            {/* Action button */}
            <div className="mt-auto">
              <div className="h-9 bg-gray-300 rounded-lg w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
