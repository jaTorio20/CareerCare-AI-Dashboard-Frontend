export const CoverLetterSkeleton = function () {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between mb-8">
        <div className="h-8 w-40 md:w-56 bg-gray-300 rounded animate-pulse" />
        <div className="h-8 w-15 md:w-40 bg-gray-300 rounded animate-pulse" />
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="p-6 rounded-xl shadow-sm bg-white animate-pulse space-y-3"
          >
            <div className="h-5 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </li>
        ))}
      </ul>
    </div>
  );
}
