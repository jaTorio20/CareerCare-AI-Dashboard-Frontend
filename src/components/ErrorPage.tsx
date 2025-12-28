import { Link } from '@tanstack/react-router';

export default function ErrorPage({ error }: { error: any }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Something went wrong: {error?.message || 'Unknown error'}
      </p>
      <div className="mb-6">
        <img
          src="/tent.svg"
          alt="Tent illustration"
          className="max-w-xs md:max-w-sm lg:max-w-md mx-auto"
        />
      </div>

      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
