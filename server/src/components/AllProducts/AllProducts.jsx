import React from 'react';

const AllProducts = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">All Products</h1>
      <p className="text-gray-500 mb-8">Browse all available products up for bidding.</p>

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
            <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Product Image
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Product {i}</h2>
            <p className="text-sm text-gray-500">Starting bid: <span className="text-purple-600 font-medium">$50.00</span></p>
            <button className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition">
              Place Bid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
