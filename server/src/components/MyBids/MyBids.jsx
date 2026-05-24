import React from 'react';
import { Link } from 'react-router-dom';

const MyBids = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Bids</h1>
        <p className="text-gray-500 mt-1">Track all the bids you have placed.</p>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">🏷️</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No bids placed yet</h2>
        <p className="text-gray-400 text-sm mb-6">You haven't placed any bids. Browse products and start bidding.</p>
        <Link
          to="/AllProducts"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default MyBids;
