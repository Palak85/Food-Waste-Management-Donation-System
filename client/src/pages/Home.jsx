import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Share Food, <span className="text-green-600">Share Hope</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Connecting surplus food with those who need it most. Join our community to reduce waste and fight hunger.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg">
          Join Now
        </Link>
        <Link to="/donations" className="bg-white text-green-600 px-8 py-3 rounded-full font-bold border-2 border-green-600 hover:bg-green-50 transition shadow-lg">
          View Donations
        </Link>
      </div>
    </div>
  );
}
