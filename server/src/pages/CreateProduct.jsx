import React from 'react';

const CreateProduct = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Product
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter product name"
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            placeholder="Describe your product"
          />
        </div>

        {/* Starting Price */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Starting Price ($)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="0.00"
          />
        </div>

        {/* Deadline */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-1">Bid Deadline</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition">
          Create Product
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
