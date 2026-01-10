import { createFileRoute } from '@tanstack/react-router'
import { getJobApplication } from '@/api/jobApplication'
import { Link } from '@tanstack/react-router'
import { StatusBadge } from '@/components/Job-Application/StatusBadge'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query';
import type { JobApplicationEntry } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'

// const jobApplicationQueryOptions = () => {
//   return queryOptions({
//     queryKey: ['applications'],
//     queryFn: async () => await getJobApplication(),
//   })
// }

export const Route = createFileRoute('/applications/')({
  head: () => ({
    meta: [
      { title: 'Job Applications', content: 'List of Job Applied' },
    ],  
  }),
  component: () => (
    <ProtectedRoute>
      <JobApplicationPage/>
    </ProtectedRoute>
  ),

  // loader: async ({context: {queryClient}}) => {
  //  return queryClient.ensureQueryData(jobApplicationQueryOptions())
  // }
})

function JobApplicationPage() {
  interface JobApplicationPageData {
    data: JobApplicationEntry[];
    nextCursor: string | null;
  }

  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 400);

  // ------- Setting up infinite query with React Query -------
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery<
    JobApplicationPageData,       // TPage (one page)
    Error,                        // TError
    { pages: JobApplicationPageData[]; pageParams: (string | undefined)[] }, // TInfiniteData
    [string, string],             // TQueryKey
    string | undefined            // TPageParam
  >({
    queryKey: ['applications', search],
    queryFn: async ({ pageParam }) => getJobApplication({ cursor: pageParam, limit: 9, search }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });


  const applications = data?.pages.flatMap(page => page.data) || [];

  // ---------- Handling search Input Change ----------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };


  // ------------ Infinite Scroll Loader ---------
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '200px', // prefetch before hitting bottom
        threshold: 0,
      }
    );

    const target = loadMoreRef.current;
      if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ------------ Scroll to top -------------
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search]);


  return (
    // <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Job Applications</h1>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm
          font-semibold text-white bg-indigo-600
           rounded-md shadow-sm hover:bg-indigo-700 
           focus:outline-nonetransition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Application</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between relative sm:max-w-sm w-full">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by job title or company..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
        
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        )}
      </div>

      {isFetching && !isFetchingNextPage ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <p className="text-gray-500 text-center">
          {search ? 'No matching applications found.' : 'No applications found.'}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((jobApplication: JobApplicationEntry) => (
            <div
              key={jobApplication._id}
              className="flex flex-col justify-between border
               border-gray-200 rounded-xl bg-white p-6 
               shadow-sm hover:shadow-lg transition transform
                hover:-translate-y-1"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {jobApplication.jobTitle}{' '}
                  <span className="text-gray-500 font-normal">@ {jobApplication.companyName}</span>
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <StatusBadge status={jobApplication.status} />
                  <span className="text-sm text-gray-500">{jobApplication.location}</span>
                </div>
              </div>

              <Link
                to={`/applications/$applicationId`}
                params={{ applicationId: jobApplication._id }}
                className="mt-6 inline-block text-center px-4 py-2 
                text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-75"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></span>
        </div>
      )}

    </div>
  );
}