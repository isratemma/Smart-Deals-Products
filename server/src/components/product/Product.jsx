import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  const { _id,title, minPrice, maxPrice, image, description } = product;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <figure className="px-4 pt-4 pb-4 ">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
      </figure>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        {/* Price range */}
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-gray-500">Price:</span>
          <span className="text-purple-600 font-medium">${minPrice}</span>
          <span className="text-gray-400">–</span>
          <span className="text-purple-600 font-medium">${maxPrice}</span>
        </div>

        {/* Button */}
        <Link
          to={`/productDetails/${product._id}`}
          className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Product;
