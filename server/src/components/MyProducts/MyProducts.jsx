import React from 'react';
import { Link } from 'react-router-dom';

const MyProducts = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-500 mt-1">Products you have listed for bidding.</p>
        </div>
        <Link
          to="/create-product"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h2>
        <p className="text-gray-400 text-sm mb-6">You haven't listed any products. Create one to get started.</p>
        <Link
          to="/create-product"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition"
        >
          Create Product
        </Link>
      </div>
    </div>
  );
};

export default MyProducts;
